import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
export const configure = () => {
    passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET }, async (payload, done) => {
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id
            }
        });

        if (user) {
            return done(null, {
                id: user.id,
            });
        }

        return done(null, false);
    }));
}