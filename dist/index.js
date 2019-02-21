"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJResponse = function (req, res, next) {
    res.JRes = new JResponse(res);
    return next();
};
var JResponse = /** @class */ (function () {
    function JResponse(res) {
        this.status = 200;
        this.res = res;
        this.response = {
            success: false,
            count: 0,
            data: [],
            errors: []
        };
    }
    JResponse.success = function (res, data, status) {
        if (data === void 0) { data = []; }
        if (status === void 0) { status = 200; }
        return res.status(status).json(JResponse.build(true, Array.isArray(data) ? data : [data]));
    };
    JResponse.errors = function (res, errors, status) {
        if (errors === void 0) { errors = []; }
        if (status === void 0) { status = 400; }
        return res.status(status).json(JResponse.build(false, null, Array.isArray(errors) ? errors : [errors]));
    };
    JResponse.build = function (success, data, errors) {
        if (data === void 0) { data = []; }
        if (errors === void 0) { errors = []; }
        if (data !== null && !Array.isArray(data)) {
            throw new Error("'data' field must be Array (if set)");
        }
        if (errors !== null && !Array.isArray(errors)) {
            throw new Error("'error' field must be Array (if set)");
        }
        var response = { success: true, count: 0, data: [], errors: [] };
        if ((Array.isArray(errors) && errors.length > 0) || (!Array.isArray(errors) && errors !== null)) {
            response.success = false;
            response.errors = errors;
        }
        if ((Array.isArray(data) && data.length > 0) || (!Array.isArray(data) && data !== null)) {
            response.data = data;
            response.count = response.data.length;
        }
        return response;
    };
    JResponse.prototype.send = function (success, data, error) {
        if (data === void 0) { data = []; }
        if (error === void 0) { error = []; }
        if (this.res === undefined || this.res === null) {
            throw new Error("Response object not initialized. You probably haven't set the middleware correctly => app.use(setJResponse());");
        }
        this.status = this.status ? this.status : 200;
        this.response = this.response ? this.response : { success: true, count: 0, data: [], errors: [] };
        if (data !== null) {
            if (Array.isArray(data) && data.length > 0) {
                this.response.data = data;
            }
            else if (!Array.isArray(data)) {
                this.response.data.push(data);
            }
            this.response.count = this.response.data.length;
        }
        if (error !== null) {
            if (Array.isArray(error) && error.length > 0) {
                this.response.errors = error;
            }
            else if (!Array.isArray(data)) {
                this.response.errors.push(error);
            }
        }
        return this.res.status(this.status).json(this.response);
    };
    JResponse.prototype.sendSuccess = function (data, status) {
        if (data === void 0) { data = null; }
        if (status === void 0) { status = 200; }
        this.status = status;
        if (data !== null) {
            Array.isArray(data) ? this.response.data = this.response.data.concat(data) : this.response.data.push(data);
        }
        this.response.success = true;
        return this.send(true);
    };
    JResponse.prototype.sendErrors = function (errors, status) {
        if (errors === void 0) { errors = null; }
        if (status === void 0) { status = 400; }
        if (errors !== null) {
            Array.isArray(errors) ? this.response.errors = this.response.errors.concat(errors) : this.response.errors.push(errors);
        }
        this.status = status;
        return this.send(false);
    };
    JResponse.prototype.appendError = function (error, status) {
        if (error === void 0) { error = null; }
        if (status === void 0) { status = 400; }
        this.status = status;
        if (error !== null) {
            Array.isArray(error) ? this.response.errors = this.response.errors.concat(error) : this.response.errors.push(error);
        }
    };
    JResponse.prototype.appendData = function (data, status) {
        if (data === void 0) { data = null; }
        if (status === void 0) { status = 200; }
        this.status = status;
        if (data !== null) {
            Array.isArray(data) ? this.response.data = this.response.data.concat(data) : this.response.data.push(data);
        }
    };
    return JResponse;
}());
exports.JResponse = JResponse;
