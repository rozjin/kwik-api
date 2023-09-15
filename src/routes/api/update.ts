import { z } from "zod";

import { Request, Response } from 'express';
import middleware from "./middleware.js";

import v from "validator";
const validator = v.default;

import { prisma } from 'kwik/prisma.js';

const User = z.object({
    name: z.string().max(32).nonempty(),
    email: z.string().email(),
    phone_number: z.string().refine((v) => validator.isMobilePhone(v, "en-NZ"))
});

const Address = z.object({
    line: z.string().nonempty(),
    unit: z.string().optional(),

    city: z.string().nonempty().optional(),
    region: z.string().nonempty(),

    postcode: z.string().max(6).min(4).nonempty()
});

const Details = z.object({
    user: User.optional(),
    address: Address.optional()
});

export const post = [
    middleware,
    async (req: Request, res: Response) => {
        const parsed = Details.safeParse(req.body);
        if (!parsed.success) {
            res.status(400);
            return res.json({
                status: "error",
                error: "Invalid Request Body"
            })
        }

        const details = parsed.data;
        const user = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                name: true,
                email: true,
                phone_number: true,

                email_verified: true,
                phone_verified: true,

                address: true
            }
        });

        if (details.user) {
            await prisma.user.update({
                where: {
                    id: req.user?.id as number
                },

                data: {
                    name: details.user.name,
                    
                    email: details.user.email,
                    email_verified: details.user.email == user?.email ? user.email_verified : false,

                    phone_number: details.user.phone_number,
                    phone_verified: details.user.phone_number == user?.phone_number ? user.phone_verified : false
                }
            });
        }

        if (details.address) {
            await prisma.user.update({
                where: {
                    id: req.user?.id as number
                },

                data: {
                    address: {
                        upsert: {
                            create: {
                                line: details.address.line,
                                unit: details.address.unit,

                                city: details.address.city,
                                region: details.address.region,

                                postcode: details.address.postcode
                            },

                            update: {
                                line: details.address.line,
                                unit: details.address.unit,

                                city: details.address.city,
                                region: details.address.region,

                                postcode: details.address.postcode
                            }
                        }
                    }
                }
            })
        }

        const data = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                name: true,
                email: true,
                phone_number: true,

                email_verified: true,
                phone_verified: true,

                address: true
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
        const data = await prisma.user.findUnique({
            where: {
                id: req.user?.id as number
            },

            select: {
                name: true,
                email: true,
                phone_number: true,

                address: true
            }
        });

        return res.json({
            status: "success",
            data: {
                user: {
                    name: data?.name,
                    email: data?.email,
                    phone_number: data?.phone_number
                },

                address: data?.address || {
                    line: "",
                    unit: "",

                    city: "",
                    region: "",

                    postcode: ""
                }
            }
        });
    }
]