import { z } from 'zod';

import v from "validator";
const validator = v.default;

import { Request, Response } from 'express';

import { Prisma } from '@prisma/client';
import { default as argon2 } from 'argon2';

import { prisma } from 'kwik/prisma.js';

const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
const Register = z.object({
    name: z.string().max(32).nonempty(),
    email: z.string().email(),
    password: z.string().max(64).min(12),
    phone_number: z.string().refine((v) => validator.isMobilePhone(v, "en-NZ"))
})

export const post = async (req: Request, res: Response) => {
    const parsed = Register.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        return res.json({
            status: "error",
            data: {
                message: "Invalid Request Body"
            }
        });
    }
    
    /*
        id Int @id @default(autoincrement())
        auth_methods UserAuth[]
        
        name String @db.VarChar(255)

        blocked Boolean?
        paused Boolean?

        email String @unique @db.VarChar(255)
        email_verified Boolean

        phone_number String @db.VarChar(255)
        phone_verified Boolean

        picture String? @db.VarChar(255)

        address String @db.Text

        currency String @db.VarChar(3)
        country String @db.VarChar(3)
        balance Float

    */
    const { name, email, password, phone_number } = parsed.data;
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                
                blocked: false,
                paused: false,

                email: email,
                email_verified: false,

                phone_number: phone_number,
                phone_verified: false,

                currency: 'NZD',
                country: 'NZL',
                balance: 0.0,

                auth: {
                    create: {
                        password: await argon2.hash(password)
                    }
                }
            }
        });

        // send activation link, require 2fa
    } catch(err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code == "P2002") {
                // send warning email to user
            }
        }

        console.log(`Error: ${err}`);
    }

    return res.json({
        status: "success",
        data: {
            message: "A link to activate your account has been sent to the email provided."
        }
    });
}