import { Request, Response } from 'express';

import middleware from "./middleware.js";
import { prisma } from 'kwik/prisma.js';

export const get = [
    middleware,
    async (req: Request, res: Response) => {
        const data = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                balance: true,
                in_transfers: {
                    select: {
                        date: true,
                        amount: true,
                        last_balance: true,
                        status: true
                    }
                },

                out_transfers: {
                    select: {
                        date: true,
                        amount: true,
                        last_balance: true,
                        status: true
                    }
                }
            }
        });

        return res.json({
            status: "success",
            data: data
        });
    }
]