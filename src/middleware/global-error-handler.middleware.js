export const globalErrorHandling = (error, req, res, next) => {
    console.error(Object.keys(error), error);

    const status = error.statusCode || 500;

    return res
        .status(status)
        .json({
            error_message: error.message || "something went wrong",
            errorBody: error.data,
            code: error.code,
        });
};

export default globalErrorHandling;