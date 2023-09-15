import { StripeSessionStatus } from '@prisma/client';
import Stripe from 'stripe';
import "stripe-event-types";
import { prisma } from 'kwik/prisma.js';
const stripe = new Stripe(process.env.STRIPE_KEY || "", {
    apiVersion: '2022-11-15'
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
export const post = async (req, res) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'] || "", webhookSecret);
    }
    catch (err) {
        res.status(400);
        return res.json({
            status: "error",
            error: "Invalid Request Body"
        });
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            await prisma.stripeSession.update({
                where: {
                    stripe_id: checkoutSessionCompleted.id
                },
                data: {
                    status: StripeSessionStatus.COMPLETED
                }
            });
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case 'checkout.session.expired':
            const checkoutSessionExpired = event.data.object;
            await prisma.stripeSession.delete({
                where: {
                    stripe_id: checkoutSessionExpired.id
                }
            });
            // Then define and call a function to handle the event checkout.session.expired
            break;
        case 'payment_intent.canceled':
            const paymentIntentCanceled = event.data.object;
            // Then define and call a function to handle the event payment_intent.canceled
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            // Then define and call a function to handle the event payment_intent.payment_failed
            break;
        case 'payment_intent.processing':
            const paymentIntentProcessing = event.data.object;
            // Then define and call a function to handle the event payment_intent.processing
            break;
        case 'payment_intent.requires_action':
            const paymentIntentRequiresAction = event.data.object;
            // Then define and call a function to handle the event payment_intent.requires_action
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        case 'payment_method.attached':
            const paymentMethodAttached = event.data.object;
            // Then define and call a function to handle the event payment_method.attached
            break;
        case 'payment_method.detached':
            const paymentMethodDetached = event.data.object;
            // Then define and call a function to handle the event payment_method.detached
            break;
        case 'payment_method.updated':
            const paymentMethodUpdated = event.data.object;
            // Then define and call a function to handle the event payment_method.updated
            break;
        case 'setup_intent.canceled':
            const setupIntentCanceled = event.data.object;
            // Then define and call a function to handle the event setup_intent.canceled
            break;
        case 'setup_intent.created':
            const setupIntentCreated = event.data.object;
            // Then define and call a function to handle the event setup_intent.created
            break;
        case 'setup_intent.requires_action':
            const setupIntentRequiresAction = event.data.object;
            // Then define and call a function to handle the event setup_intent.requires_action
            break;
        case 'setup_intent.setup_failed':
            const setupIntentSetupFailed = event.data.object;
            // Then define and call a function to handle the event setup_intent.setup_failed
            break;
        case 'setup_intent.succeeded':
            const setupIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event setup_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled stripe event ${event.type}`);
    }
};
