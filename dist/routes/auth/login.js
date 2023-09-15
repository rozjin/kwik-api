import { z } from 'zod';
import { default as argon2 } from 'argon2';
import { default as jwt } from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from 'kwik/prisma.js';
const Login = z.object({
    email: z.string().email(),
    password: z.string().max(64).min(12),
});
export const post = async (req, res) => {
    const parsed = Login.safeParse(req.body);
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
      name String? @db.VarChar(255)

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
    const { email, password } = parsed.data;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                auth: true
            }
        });
        const hashed = user?.auth?.password;
        if (!hashed) {
            throw new Error("No such password");
        }
        const matches = await argon2.verify(hashed, password);
        if (!matches) {
            throw new Error("No match on password");
        }
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await prisma.userAuth.update({
            where: {
                id: user.auth?.id,
            },
            data: {
                refreshToken
            }
        });
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT Secret not configured");
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "30m",
            issuer: 'nz.kwik.api',
            audience: 'nz.kwik.app'
        });
        return res.json({
            status: "success",
            message: "Logged in successfully",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number
                },
                refreshToken,
                token
            }
        });
        // send 2fa codes and otp login
    }
    catch (err) {
        // send login attempt, lock after too many attempts
        res.status(401);
        return res.json({
            status: "error",
            data: {
                message: "Invalid Username or Password"
            }
        });
    }
};
