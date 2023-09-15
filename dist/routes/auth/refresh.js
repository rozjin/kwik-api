import { z } from "zod";
import { default as jwt } from 'jsonwebtoken';
import { prisma } from 'kwik/prisma.js';
const Refresh = z.object({
    refreshToken: z.string().nonempty()
});
export const post = async (req, res) => {
    const parsed = Refresh.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        return res.json({
            status: "error",
            error: "Invalid Request Body"
        });
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
    const user = await prisma.user.findUnique({
        where: {
            id: auth.user_id
        }
    });
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT Secret not configured");
    }
    const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET, {
        expiresIn: "30m",
        issuer: 'nz.kwik.api',
        audience: 'nz.kwik.app'
    });
    return res.json({
        status: "success",
        message: "Token refreshed",
        data: {
            token
        }
    });
};
