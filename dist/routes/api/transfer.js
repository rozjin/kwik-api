import { z } from "zod";
import middleware from "./middleware.js";
import { prisma } from 'kwik/prisma.js';
import { generate } from "randomstring";
import { TransferStatus } from "@prisma/client";
const Transfer = z.object({
    payee: z.string().email(),
    currency: z.string().optional().default("NZD"),
    amount: z.number()
        .refine(x => x * 100 - Math.trunc(x * 100) < Number.EPSILON),
    desc: z.string().nonempty().optional(),
});
export const post = [
    middleware,
    async (req, res) => {
        const parsed = Transfer.safeParse(req.body);
        if (!parsed.success) {
            res.status(400);
            return res.json({
                status: "error",
                error: "Invalid Request Body"
            });
        }
        const transfer = parsed.data;
        try {
            const tx = await prisma.$transaction(async (ctx) => {
                try {
                    const sender = await ctx.user.update({
                        where: {
                            id: req.user?.id
                        },
                        data: {
                            balance: {
                                decrement: transfer.amount
                            }
                        }
                    });
                    const recepient = await ctx.user.update({
                        where: {
                            email: transfer.payee
                        },
                        data: {
                            balance: {
                                increment: transfer.amount
                            }
                        }
                    });
                    const tx = await ctx.transfer.create({
                        data: {
                            friendly_id: generate({
                                length: 12,
                                capitalization: "uppercase"
                            }),
                            status: TransferStatus.INIT,
                            status_reason: "Initiated transaction",
                            currency: transfer.currency,
                            desc: transfer.desc,
                            amount: transfer.amount,
                            last_balance: (await prisma.user.findUnique({
                                where: {
                                    id: req.user?.id
                                }
                            }))?.balance,
                            stripe_id: "",
                            to: {
                                connect: {
                                    id: recepient.id
                                }
                            },
                            from: {
                                connect: {
                                    id: sender.id
                                }
                            }
                        },
                    });
                    if (sender.balance < 0) {
                        await ctx.transfer.update({
                            where: {
                                id: tx.id
                            },
                            data: {
                                status: TransferStatus.FAILED,
                                status_reason: "Insufficient funds.",
                            }
                        });
                        throw new Error(`You don't have enough funds to send ${transfer.amount}`);
                    }
                    return tx;
                }
                catch (err) {
                    throw new Error(`Failed to initiate transfer.`);
                }
            });
            return res.json({
                status: "success",
                data: {
                    from: (await prisma.user.findUnique({
                        where: {
                            id: req.user?.id
                        }
                    }))?.email,
                    to: transfer.payee,
                    amount: tx.amount,
                    date: tx.date,
                    message: "Your money has been sent, please check your email for confirmation."
                }
            });
        }
        catch (err) {
            return res.json({
                status: "error",
                data: {
                    message: err.message
                }
            });
        }
    }
];