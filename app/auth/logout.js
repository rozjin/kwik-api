import { PrismaClient } from "@prisma/client"
import { z } from "zod";

const prisma = new PrismaClient();
const Refresh = z.object({
    refreshToken: z.string().nonempty()
});

export const post = async (req, res) => {
    if (!Refresh.safeParse(req.body)) {
        res.status(400);
        return res.json({
            status: "error",
            error: "Invalid Request Body"
        })
    }

    const auth = await prisma.userAuth.findUnique({
        where: {
            refreshToken: req.body.refreshToken
        }
    });

    if (!auth) {
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