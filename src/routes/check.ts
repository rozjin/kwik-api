import { Request, Response } from "express";

export const get = async(req: Request, res: Response) => {
    return res.json({
        status: "success",
        message: "Hey there"
    });
}