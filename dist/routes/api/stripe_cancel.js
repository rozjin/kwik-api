import { StripeSessionStatus } from '@prisma/client';
import { prisma } from 'kwik/prisma.js';
export const get = async (req, res) => {
    const { session_id, origin } = req.query;
    if (!session_id || !origin) {
        res.status(400);
        return res.json({
            status: "error",
            error: "Invalid Request Query"
        });
    }
    await prisma.stripeSession.update({
        where: {
            stripe_id: session_id
        },
        data: {
            status: StripeSessionStatus.FAILED
        }
    });
    return res.redirect(origin);
};
