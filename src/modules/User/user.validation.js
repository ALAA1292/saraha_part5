import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid user id");

export const userIdSchema = 
     z.strictObject({ userId: objectId })


export const updateProfileSchema = z.strictObject({

    firstName: z.string()
        .trim()
        .min(3, "firstName must be at least 3 chars")
        .max(30, "firstName can not be more than 30 chars")
        .optional(),

    lastName: z.string()
        .trim()
        .min(3, "lastName must be at least 3 chars")
        .max(30, "lastName can not be more than 30 chars")
        .optional(),
    email: z.email().optional(),

    password: z.string()
        .min(6)
        .max(16)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "password must contain uppercase, lowercase and a number"
        )
        .optional(),

    gender: z.enum(["male", "female", "other"]).optional(),

    age: z.number()
        .int()
        .min(18, "age must be at least 18")
        .max(100, "age can not be more than 100")
        .optional(),

    phoneNumber: z.string()
        .regex(/^\+?[0-9]{10,15}$/, "invalid phone number")
        .optional(),

    profilePicture: z.string().optional()

});

export const generalUpdateSchema=z.object({
    
    body:updateProfileSchema,
   
})
export const generalUserIdSchema=z.object({
    params:userIdSchema,
    
   
})