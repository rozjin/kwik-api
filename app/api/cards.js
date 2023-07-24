import middleware from './middleware.js';
import { PrismaClient, StripeSessionStatus } from '@prisma/client';
import Stripe from 'stripe';
import { z } from 'zod';

const prisma = new PrismaClient();
const stripe = new Stripe('sk_test_Hrs6SAopgFPF0bZXSN3f6ELN');
export const get = [
    middleware,
    async (req, res) => {
        const data = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },

            select: {
                stripe_customer_id: true,
                stripe_connect_id: true,
                stripe_verified: true
            }
        });

        let customer_id = data.stripe_customer_id;
        if (customer_id == null) {
            const customer = await stripe.customers.create();
            customer_id = customer.id;
            await prisma.user.update({
                where: {
                    id: req.user.id
                },

                data: {
                    stripe_customer_id: customer_id
                }
            });
        }

        const cards = await stripe.paymentMethods.list({
            customer: customer_id,
            type: 'card'
        });

        return res.json({
            status: "success",
            data: cards.data.map(({ card }) => ({
                brand: card.brand,
                funding: card.funding,
                digits: card.last4,
                expiry: `${card.exp_month}/${String(card.exp_year).slice(-2)}`
            }))
        });
    }
]

const Card = z.object({
    op: z.enum(["new", "delete", "continue", "select"]),
    session_id: z.string().optional()
});

export const post = [
    middleware,
    async (req, res) => {
        if (!Card.safeParse(req.body)) {
            res.status(400);
            return res.json({
                status: "error",
                error: "Invalid Request Body"
            })
        }

        
        const { op, session_id } = req.body;
        const data = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },

            select: {
                stripe_customer_id: true,
                stripe_connect_id: true,
                stripe_verified: true
            }
        });

        switch(op) {
            case 'new': {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'setup',
                    customer: data.stripe_customer_id,
                    success_url: req.url,
                    cancel_url: req.url
                });

                await prisma.user.update({
                    where: {
                        id: req.user.id
                    },

                    data: {
                        stripe_sessions: {
                            create: [
                                { status: StripeSessionStatus.WAITING, stripe_id: session.id }
                            ]
                        }
                    }
                });

                return res.json({
                    status: "success",
                    data: {
                        url: session.url
                    }
                });
            }
        }
    }
]