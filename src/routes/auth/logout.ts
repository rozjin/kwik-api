import { z } from "zod";

import { Request, Response } from 'express';

import { prisma } from 'kwik/prisma.js';

const Logout = z.object({
    refreshToken: z.string().nonempty()
});

export const post = async (req: Request, res: Response) => {
    const parsed = Logout.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        return res.json({
            status: "error",
            error: "Invalid Request Body"
        })
    }

    const auth = await prisma.userAuth.findUnique({
        where: {
            refreshToken: parsed.data.refreshToken
        }
    });

    if (auth == null) {
        res.status(403);
        return res.json({
            status: "error",
            data: {
                message: "Invalid refresh token"
            }
        });
    }

    await prisma.userAuth.update({
        where: {
            refreshToken: parsed.data.refreshToken
        },

        data: {
            refreshToken: null
        }
    });

    return res.json({
        status: "success",
        data: {
            message: "Logged out successfully"
        }
    });
}
