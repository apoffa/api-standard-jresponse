export const setJResponse = (req: any, res: any, next: any) => {
    res.JRes = new JResponse(res);
    return next();
};

export class JResponse {

    private readonly res: any;
    private status = 200;
    private response: any;

    constructor(res: any) {
        this.res = res;
        this.response = {
            success: false,
            count: 0,
            data: [],
            errors: []
        };
    }

    static success(res: any, data: any = [], status = 200) {
        return res.status(status).json(JResponse.build(true, Array.isArray(data) ? data : [data]));
    }

    static errors(res: any, errors: any = [], status = 400) {
        return res.status(status).json(JResponse.build(false, null, Array.isArray(errors) ? errors : [errors]));
    }

    static build(success: boolean, data: any = [], errors: any = []) {
        if (data !== null && !Array.isArray(data)) {
            throw new Error("'data' field must be Array (if set)");
        }
        if (errors !== null && !Array.isArray(errors)) {
            throw new Error("'error' field must be Array (if set)");
        }
        const response: any = {success: true, count: 0, data: [], errors: []};
        if ((Array.isArray(errors) && errors.length > 0) || errors !== null) {
            response.success = false;
            response.errors = errors;
        }
        if ((Array.isArray(data) && data.length > 0) || data !== null) {
            response.data = data;
            response.count = response.data.length;
        }
        return response;
    }

    send(success: boolean, data: any = [], error: any = []) {
        if (this.res === undefined || this.res === null) {
            throw new Error("Response object not initialized. You probably haven't set the middleware correctly => app.use(setJResponse());");
        }
        this.status = this.status ? this.status : 200;
        this.response = this.response ? this.response : {success: true, count: 0, data: [], errors: []};
        if (data !== null) {
            if (Array.isArray(data) && data.length > 0) {
                this.response.data = data;
            } else if (!Array.isArray(data)) {
                this.response.data.push(data);
            }
            this.response.count = this.response.data.length;
        }
        if (error !== null) {
            if (Array.isArray(error) && error.length > 0) {
                this.response.errors = error;
            } else if (!Array.isArray(data)) {
                this.response.errors.push(error);
            }
        }
        return this.res.status(this.status).json(this.response);
    }

    sendSuccess(data: any = null, status = 200) {
        this.status = status;
        if (data !== null) {
            Array.isArray(data) ? this.response.data = this.response.data.concat(data) : this.response.data.push(data);
        }
        this.response.success = true;
        return this.send(true);
    }

    sendErrors(errors: any = null, status = 400) {
        if (errors !== null) {
            Array.isArray(errors) ? this.response.errors = this.response.errors.concat(errors) : this.response.errors.push(errors);
        }
        this.status = status;
        return this.send(false);
    }

    appendError(error: any = null, status = 400) {
        this.status = status;
        if (error !== null) {
            Array.isArray(error) ? this.response.errors = this.response.errors.concat(error) : this.response.errors.push(error);
        }
    }

    appendData(data: any = null, status = 200) {
        this.status = status;
        if (data !== null) {
            Array.isArray(data) ? this.response.data = this.response.data.concat(data) : this.response.data.push(data);
        }
    }
}
