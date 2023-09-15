import passport from "passport"

import { NextFunction, Request, Response } from 'express';

const middleware = async(req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (
        err: any, 
        user?: Express.User | false | null, 
        info?: object | string | Array<string | undefined>, 
        status?: number | Array<number | undefined>) => {
        if (err) return next(err);
        if (!user) {
            res.status(401);
            return res.json({
                status: "error",
                data: {
                    message: "Unauthorized"
                }
            });
        }

        req.user = user;
        return next();
    })(req, res, next);
}

export default middleware;
