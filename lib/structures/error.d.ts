declare class SquareCloudAPIError extends TypeError {
    constructor(code: string, message?: string, options?: {
        stack?: string;
        cause?: unknown;
    });
}

export { SquareCloudAPIError };
