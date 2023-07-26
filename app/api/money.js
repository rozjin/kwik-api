import middleware from "./middleware.js";
import { prisma } from "../prisma.js";

export const get = [
    middleware,
    async (req, res) => {
        const data = await prisma.user.findUnique({
            where: {
                id: req.user.id
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

        console.log(data);

        return res.json({
            status: "success",
            data: data
        });
    }
]