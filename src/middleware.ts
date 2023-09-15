import { NextFunction, Request, Response } from "express";

class NotFoundError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message);
        this.message = message;
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError)
        }

        this.name = "NotFoundError"
    }
}

const middleware = [
    async(req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError("Route not found", 404));
    },

    async(err: NotFoundError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);
        res.json({
            "status": err.status,
            "data": {
                "message": err.message
            }
        });
    }
]

export default middleware;