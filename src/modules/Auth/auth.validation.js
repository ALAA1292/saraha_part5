import { z } from "zod";

export const loginSchema = z.strictObject({
    email: z.email(),
password: z.string()
    .min(6)
    .max(16)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "password must contain uppercase, lowercase and a number")
});


export const generalLogin=z.object({
    body:loginSchema,
    query:z.strictObject({
        lang:z.enum(["en","ar"]).default("en")
    })
})
export const signupSchema = loginSchema.extend({
    firstName: z.string().trim().min(3, "firstName must be at least 3 chars").max(30, "firstName can not be more than 30 chars"),
    lastName: z.string().trim().min(3, "lastName must be at least 3 chars").max(30, "lastName can not be more than 30 chars"),

    confirmPassword: z.string(),

    gender: z.enum(["male", "female", "other"]).default("male"),
    age: z.number().int().min(18, "age must be at least 18").max(100, "age can not be more than 100").optional(),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "invalid phone number").optional(),
    profilePicture: z.string().optional(),
    role:z.enum(["admin", "user"]).default("user")
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
});

export const generalSignup=z.object({
    body:signupSchema,
   
})