class HttpAppError extends Error {

    statusCode;
    data;
    code;

    constructor(
        message,
        statusCode = 400,
        data = {},
        code = 'BAD_REQUEST'
    ) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.code = code;
    }
}

export default HttpAppError;