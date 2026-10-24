import { DeleteUser, GetAllUsers, GetUserProfile, UpdateProfile } from "./user.service.js";
import { Router } from "express";
import { validation } from './../../middleware/validation.middleware.js';
import { generalUpdateSchema, generalUserIdSchema } from "./user.validation.js";
import { authenticate } from "../../middleware/authentication.middleware.js";
import { authorize } from "../../middleware/authorization.middleware.js";
import { roleEnum } from "../../Common/Constants.js";
const userController = Router();



//get user profile

userController.get("/profile",authenticate,authorize([roleEnum.USER]),async (req,res,next)=>{
    const result= await GetUserProfile(req.authUser)
    return res.status(200).json({ message: "user profile fetched succefully", data:result })
})






//update profile
userController.patch("/update",authenticate,authorize([roleEnum.ADMIN,roleEnum.USER]),validation(generalUpdateSchema),async (req,res)=>{
     const {  body } = req.validate
    const result= await UpdateProfile(req.authUser._id ,body)
    return res.status(200).json({ message: "user profile updated succefully", data:result })
})


//delete user
userController.delete("/delete",authenticate,authorize([roleEnum.ADMIN,roleEnum.USER]),async (req,res)=>{
    const result= await DeleteUser(req.authUser._id)
    return res.status(200).json({ message: "user profile deleted succefully", data:result })
})


//get all users

userController.get("/list",authenticate,authorize([roleEnum.ADMIN]), async(req,res)=>{
    const result= await GetAllUsers()
    return res.status(200).json({ message: "all users profiles fetched succefully", data:result })
})

export default userController;
