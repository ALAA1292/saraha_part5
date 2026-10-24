import HttpAppError from "../Utils/Security/Errors/app.error.js";

export const validation = (schema) => (req, res, next) => {
    const validationResult = schema.safeParse({
        body:req.body,
        query:req.query,
        params:req.params

    });
    if (!validationResult.success) {
    throw new HttpAppError(
    "validation error",
    400,
    validationResult.error.issues,
    "VALIDATION_ERROR"
);
    }
    req.validate = validationResult.data;
    next();
};

// router.post("/signup", validate(signupSchema), signup);