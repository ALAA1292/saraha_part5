import jwt from "jsonwebtoken";
import { BadRequestException, UnauthorizedException } from "./Errors/exceptions.error.js";
import envConfig from './../../../config/config.service.js';
import UserRepository from "../../DB/Repositories/user.repository.js";
import { tokenTypeEnum } from "../../Common/Constants.js";
import { get } from "../../Common/Services/redis.service.js";
const userRepo = new UserRepository()


export const generateToken = (payloud, secret, options) => {
    return jwt.sign(payloud, secret, options)
}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

export const decodedToken = async ({ token, tokenType }) => {
    const data = jwt.decode(token)
    console.log(data)
    if (!data.role) {
        throw new BadRequestException('role is not found in the exception', null, 'MISSING_ROLE')
    }
    const roleSignatures = envConfig.jwt[data.role];
    let signature;
        console.log(roleSignatures,tokenType)

    switch (tokenType) {
        case tokenTypeEnum.ACCESS_TOKEN:
            signature = roleSignatures.access_token_secret;
            break;
        case tokenTypeEnum.REFRESH_TOKEN:
            signature = roleSignatures.refresh_token_secret;
            break;
        default:
            throw new BadRequestException(`Invalid token type`, null, "INVALID_TOKEN_TYPE");
    }
    console.log(signature)

    const decodedData = verifyToken(token, signature)

    const isTokenBlackListed= await get(`bl_${tokenType}_${decodedData.jti}`)
    if(isTokenBlackListed)
    {
        throw new UnauthorizedException('this token is revoked try to re-login',null, 'REVOKED_TOKEN')
    }
    const user = await userRepo.FindDocumentById(decodedData._id);
    if (!user) {
        throw new HttpAppError(
            "user not found",
            404,
            {},
            "USER_NOT_FOUND"
        );
    }
    return{user , tokenData:decodedData} ;

}