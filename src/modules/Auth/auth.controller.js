import { Router } from 'express'
import { SignUp, SignIn, refreshToken, googleLogin, googleRegister, logout } from './auth.service.js';
import { generalLogin, generalSignup, loginSchema, signupSchema } from './auth.validation.js';
import HttpAppError from '../../Utils/Security/Errors/app.error.js';
import { validation } from '../../middleware/validation.middleware.js';
import { BadRequestException } from '../../Utils/Security/Errors/exceptions.error.js';
import { authenticate } from './../../middleware/authentication.middleware.js';
import { decodeRefreshToken } from '../../middleware/decodeRefreshToken.middleware.js';

const authController = Router();

//creating new user

authController.post("/signup", validation(generalSignup), async (req, res) => {

    const result = await SignUp(req.validate.body)
    return res.status(201).json({ message: "user registered succefully", data: result })
})


//signin

authController.post("/signin", validation(generalLogin), async (req, res, next) => {


    const result = await SignIn(req.validate.body)
    return res.status(200).json({ message: "user logged succefully", data: result })
})

//refresh token
authController.post('/refresh-token', async (req, res, next) => {

    const { refreshtoken } = req.headers
    if (!refreshtoken) {
        throw new BadRequestException("refresh token is required", null, "MISSING_REFRESH_TOKEN")

    }
    const result = await refreshToken(refreshtoken)
    return res.status(200).json({ message: "token refreshed succefully", data: result })

})


//signup with gmail

authController.post("/google-signup", async (req, res) => {

    const { idToken } = req.body
    if (!idToken) {

        throw new BadRequestException('google id token is required', null, 'MISSING-GOOGLE-ID-TOKEN')

    }
    const result = await googleRegister(idToken)
    return res.status(201).json({ message: "user registered succefully", data: result })

})


//login with gmail

authController.post("/google-login", async (req, res) => {
    const { idToken } = req.body

    console.log(idToken)

    if (!idToken) {

        throw new BadRequestException('google id token is required', null, 'MISSING-GOOGLE-ID-TOKEN')


    }
    const result = await googleLogin(idToken)
    return res.status(200).json({ message: "user loggedin succefully", data: result })
})

//logout

authController.post("/logout",authenticate,decodeRefreshToken, async (req, res) => {

    console.log({refreshToken:req.refreshTokenData, accessTokenData:req.accessTokenData})
    const result = await logout(req.accessTokenData, req.refreshTokenData)
    return res.status(200).json({ message: "user logged-out succefully", data: result })
})


export default authController