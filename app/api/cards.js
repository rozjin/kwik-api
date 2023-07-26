import middleware from './middleware.js';
import { StripeSessionStatus } from '@prisma/client';
import Stripe from 'stripe';
import { z } from 'zod';

import { prisma } from '../prisma.js';

const stripe = new Stripe(process.env.STRIPE_KEY);
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
                email: true,

                stripe_customer_id: true,
                stripe_connect_id: true,
                stripe_verified: true
            }
        });

        const success_url = `https://api.moirai.nz/api/stripe_success&session_id={CHECKOUT_SESSION_ID}&origin=${req.url}`
        const cancel_url = `https://api.moirai.nz/api/stripe_cancel&session_id={CHECKOUT_SESSION_ID}&origin=${req.url}`

        switch(op) {
            case 'new': {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'setup',
                    customer: data.stripe_customer_id,
                    success_url: success_url,
                    cancel_url: cancel_url,
                    customer_email: data.email
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