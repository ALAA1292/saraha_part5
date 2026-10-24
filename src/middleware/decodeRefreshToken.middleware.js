import { tokenTypeEnum } from "../Common/Constants.js";
import HttpAppError from "../Utils/Security/Errors/app.error.js"
import { decodedToken } from "../Utils/Security/token.utils.js";




export const decodeRefreshToken = async (req, res, next) => {
    const { refreshtoken } = req.headers

    if (!refreshtoken) {
        throw new HttpAppError(
            "refreshtoken header is missing",
            401,
            {},
            "MISSING_REFRESHTOKEN_HEADER"
        );
    }
    const[prefix,token]=refreshtoken.split(' ')
    if(prefix!='Bearer' || !token)
    {
        throw new HttpAppError(
            "invalid refreshtoken header format",
            401,
            {},
            "INVAID_REFRESHTOKEN_HEADER"
        );
    }

   const{tokenData}  =await decodedToken({token,tokenType:tokenTypeEnum.REFRESH_TOKEN})
    req.refreshTokenData=tokenData

   next()
}