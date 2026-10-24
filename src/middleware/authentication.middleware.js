import { tokenTypeEnum } from "../Common/Constants.js";
import UserRepository from "../DB/Repositories/user.repository.js";
import HttpAppError from "../Utils/Security/Errors/app.error.js"
import { decodedToken } from "../Utils/Security/token.utils.js";

const userRepo = new UserRepository()



export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        throw new HttpAppError(
            "authorization header is missing",
            401,
            {},
            "MISSING_AUTHORIZATION_HEADER"
        );
    }
    const [prefix, token] = authorization.split(' ')
    if (prefix != 'Bearer' || !token) {
        throw new HttpAppError(
            "invalid authorization header format",
            401,
            {},
            "INVAID_AUTHORIZATION_HEADER"
        );
    }

    const { user, tokenData } = await decodedToken({ token, tokenType: tokenTypeEnum.ACCESS_TOKEN })
    req.authUser = user
    req.accessTokenData = tokenData

    next()
}