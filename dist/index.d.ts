export declare const setJResponse: (req: any, res: any, next: any) => any;
export declare class JResponse {
    private readonly res;
    private status;
    private response;
    constructor(res: any);
    static success(res: any, data?: any, status?: number): any;
    static errors(res: any, errors?: any, status?: number): any;
    static build(success: boolean, data?: any, errors?: any): any;
    send(success: boolean, data?: any, error?: any): any;
    sendSuccess(data?: any, status?: number): any;
    sendErrors(errors?: any, status?: number): any;
    appendError(error?: any, status?: number): void;
    appendData(data?: any, status?: number): void;
}
