const Order = require('../../../models/order');
const StripeOnlinePayment = require('../../../models/Payment')
const createError = require('http-errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const crypto = require('crypto')

const commitPayment = async (order_id) => {
    const order = await Order.findById(order_id).populate('products.product');
    if (!order) {
        throw createError(404,'order not found');
    }
    const currency =  'USD';

    const line_items = order?.products.map(item => ({
        price_data: {
            currency: currency,
            product_data: { name: item?.product?.title },
            unit_amount: Math.round(item?.price * 100),
        },
        quantity: item.qty,
    }));

    const token = crypto.randomBytes(20).toString('hex');
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.WEB_URL}/stripe-payment/${order_id}/success?token=${token}`,
        cancel_url: `${process.env.WEB_URL}/stripe-payment/${order_id}/cancel`,
        metadata: {
            order_id: order_id,
            token: token
        }
    });
    await StripeOnlinePayment.create({
        reference: `ORDER${order_id}`,
        paymentId: session.id,
        amount: order.total,
        payment_status: session.payment_status,
        currency: currency,
        token: token,
    });

    return session;
};


const completePayment = async (order_id, token) => {
    const order = await Order.findById(order_id);
    if (!order) {
        throw createError(404, 'Order not found');
    }

    const payment = await StripeOnlinePayment.findOne({ token });
    if (!payment) {
        throw createError(404, 'Payment record not found');
    }

    const session = await stripe.checkout.sessions.retrieve(payment.paymentId); 
    if (session?.payment_status === 'paid') {
        payment.status = session.payment_status;
        await payment.save();

        order.paymentStatus = session.payment_status;
        order.orderStatus = 'in_progress';
        await order.save(); 
    } else {
        throw createError(400, 'Payment not completed');
    }

    return session;
};


module.exports = {
    commitPayment,
    completePayment
};
