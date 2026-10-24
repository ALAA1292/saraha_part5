import HttpAppError from "./app.error.js";


export class UnauthorizedException extends HttpAppError{
constructor(message,data,code){
    super(message,401,code,data)
}
}

export class BadRequestException extends HttpAppError {
    constructor(message, data, code) {
        super(message, 400, data, code);
    }
}
