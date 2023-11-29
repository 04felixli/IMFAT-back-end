class ResponseBase {
    success;
    code;
    msg;
    errors;

    constructor(success, code, msg, errors = null) {
        this.success = success;
        this.code = code;
        this.msg = msg;
        this.errors = errors;
    }
}