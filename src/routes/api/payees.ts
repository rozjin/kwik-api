import { z } from "zod";

import { Request, Response } from 'express';

import middleware from "./middleware.js";
import validator from 'validator';

import { prisma } from 'kwik/prisma.js';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const Payee = z.object({
    name: z.string().max(32).nonempty(),
    picture: z.any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional(),
    email: z.string().email(),
});

const Request = z.object({
    op: z.enum(["remove", "update"]),
    payees: z.array(Payee)
})

export const post = [
    middleware,
    async (req: Request, res: Response) => {
        const parsed = Request.safeParse(req.body)
        if (!parsed.success) {
            res.status(400);
            return res.json({
                status: "error",
                error: "Invalid Request Body"
            })
        }

        const { op, payees } = parsed.data;
        switch (op) {
            case "update": {
                await prisma.$transaction(payees.map((payee) =>
                    prisma.user.update({
                        where: {
                            id: req.user?.id as number
                        },

                        data: {
                            payees: {
                                upsert: {
                                    where: {
                                        email: payee.email
                                    },

                                    create: {
                                        email: payee.email,
                                        name: payee.name,
                                        picture: payee.picture
                                    },

                                    update: {
                                        name: payee.name,
                                        picture: payee.picture
                                    }
                                }
                            }
                        }
                    })
                ))

                break;
            }

            case "remove": {
                await prisma.user.update({
                    where: {
                        id: req.user?.id as number
                    },

                    data: {
                        payees: {
                            deleteMany: {
                                email: {
                                    in: payees.map((payee) => payee.email)
                                }
                            }
                        }
                    }
                })

                break;
            }
        }

        const data = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                payees: {
                    select: {
                        name: true,
                        email: true,
                        picture: true
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

export const get = [
    middleware,
    async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                payees: true
            }
        });

        return res.json({
            status: "success",
            data: {
                payees: user?.payees.map(payee => ({ name: payee.name, email: payee.email, picture: payee.picture }))
            }
        });
    }
]