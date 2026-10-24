import envConfig from '../../../config/config.service.js';
import UserRepository from '../../DB/Repositories/user.repository.js';
import { encrypt } from '../../Utils/Security/encryption.secuirty.js';
import HttpAppError from '../../Utils/Security/Errors/app.error.js';
import { compareTwoHashes, hash } from '../../Utils/Security/hash.secuirty.js';
import jwt from "jsonwebtoken";
import { generateToken } from '../../Utils/Security/token.utils.js';
import { decodedToken } from './../../Utils/Security/token.utils.js';
import { providersEnum, tokenTypeEnum } from '../../Common/Constants.js';
import { OAuth2Client } from 'google-auth-library';
import { BadRequestException } from '../../Utils/Security/Errors/exceptions.error.js';
import { randomBytes } from 'node:crypto';
import { calculateTTL, set } from '../../Common/Services/redis.service.js';
import { v4 as uuidv4 } from 'uuid';
import { promise } from 'zod';


const userRepo = new UserRepository()

//creating new user

export const SignUp = async (body) => {
  const { firstName, lastName, email, password, gender, age, phoneNumber, role } = body;
  const isUserExist = await userRepo.findUserByEmail(email);
  if (isUserExist) {
    throw new HttpAppError(`user already exists`, 409, { duplicatedEmail: email }, 'EMAIL_CONFLICT');
  }

  // const encryptedPhone = encrypt(phoneNumber)
  const encryptedPhone = phoneNumber
    ? encrypt(phoneNumber)
    : undefined;

  //hashing password

  const hashedPassword = await hash(password)
  const user = await userRepo.CreateDocument({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhone, role });

  const result = user.toObject();
  delete result.password;
  return result;
};


//build tokens

const buildTokens = (user) => {
  const currentRole = user.role

  const token = generateToken(
    { _id: user._id, role: currentRole },
    envConfig.jwt[currentRole].access_token_secret,
    { expiresIn: envConfig.jwt[currentRole].access_token_expires_in, jwtid: uuidv4() }
  );

  //generate refresh token
  const refreshToken = generateToken(
    { _id: user._id, role: currentRole },
    envConfig.jwt[currentRole].refresh_token_secret,
    { expiresIn: envConfig.jwt[currentRole].refresh_token_expires_in, jwtid: uuidv4() }
  );
  // console.log(token);
  // console.log(envConfig.jwt[user.role].access_token_expires_in)
  const result = user.toObject();
  delete result.password;
  return {

    accessToken: token,
    refreshToken,
  };
}



//signin

export const SignIn = async (data) => {
  const { email, password } = data
  const user = await userRepo.FindOneDocument({ email, provider: providersEnum.SYSTEM });
  if (!user) {
    throw new HttpAppError(
      "wrong email or password",
      400,
      {},
      "INVALID_CREDENTIALS"
    );
  }
  const isPasswordCorrect = await compareTwoHashes(user.password, password)
  if (!isPasswordCorrect) {
    // throw new Error(`wrong email or password`);
    throw new HttpAppError(
      "wrong email or password",
      400,
      {},
      "INVALID_CREDENTIALS"
    );
  }

  return buildTokens(user)
}


//refresh token
export const refreshToken = async (userRefeshToken) => {

  const user = await decodedToken({ token: userRefeshToken, tokenType: tokenTypeEnum.REFRESH_TOKEN })
  const currentRole = user.role

  const accessToken = generateToken({ _id: user._id, role: currentRole },
    envConfig.jwt[currentRole].access_token_secret,
    { expiresIn: envConfig.jwt[currentRole].access_token_expires_in })
  return {
    message: 'Token refreshed successfully',
    accessToken,
  };
}

//verify idToken

const verifyIdToken = async (token) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: envConfig.GCP.client_id,
  });
  const payload = ticket.getPayload();
  return payload;
}



//update or create google-signup
const updateOrCreate = async (user, googleTokenPayload) => {
  const { sub, email, given_name, family_name } = googleTokenPayload
  if (user) {
    return userRepo.UpdateDocumentById(user._id, { email: email, firstName: given_name, lastName: family_name }, { new: true })
  }
  else {
    const hashedPassword = await hash(randomBytes(12).toString('hex'))
    return userRepo.CreateDocument({
      googleSub: sub,
      provider: providersEnum.GOOGLE,
      firstName: given_name,
      lastName: family_name || '',
      email,
      password: hashedPassword
    })
  }
}

//google-register


export const googleRegister = async (idToken) => {

  const googleTokenPayload = await verifyIdToken(idToken)
  if (!googleTokenPayload || !googleTokenPayload.email_verified) {
    throw new BadRequestException('not verified email', null, 'NOT-VERIFIED-EMAIL')
  }
  const user = await userRepo.FindOneDocument({ googleSub: googleTokenPayload.sub, provider: providersEnum.GOOGLE })
  const handleUser = await updateOrCreate(user, googleTokenPayload)
  // console.log(buildTokens(handleUser))
  return buildTokens(handleUser)

}

//google-login

export const googleLogin = async (idToken) => {

  const googleTokenPayload = await verifyIdToken(idToken);
  if (!googleTokenPayload || !googleTokenPayload.email_verified) {
    throw new BadRequestException("Google email is not verified", null, 'GOOGLE_EMAIL_NOT_VERIFIED');
  }

  const user = await userRepo.FindOneDocument({ googleSub: googleTokenPayload.sub, provider: providersEnum.GOOGLE });

  if (!user) {
    throw new BadRequestException("User not found. Please register first.", null, 'USER_NOT_FOUND');
  }

  return buildTokens(user)

}

//logout

export const logout = async (accessTokenData,refreshTokenData) => {

  const{exp:accessExpiration, jti:accessId}=accessTokenData
    const{exp:refreshExpiration, jti:refreshId}=refreshTokenData

const accessTTL=calculateTTL(accessExpiration)
const refreshTTL=calculateTTL(refreshExpiration)

set({key:`bl_${tokenTypeEnum.ACCESS_TOKEN}_${accessId}`,value:"true", options:{EX:accessTTL}})
set({key:`bl_${tokenTypeEnum.REFRESH_TOKEN}_refresh_${refreshId}`,value:"true", options:{EX:refreshTTL}})

return{accessTTL,refreshTTL}
}