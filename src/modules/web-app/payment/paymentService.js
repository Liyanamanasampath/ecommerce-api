const Order = require('../../../models/order');
const StripeOnlinePayment = require('../../../models/Payment')
const createError = require('http-errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const crypto = require('crypto');
const { prisma } = require('../../../config/dbConnect');

const commitPayment = async (orderId) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        total: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
  
    if (!order) {
      throw createError(404, 'Order not found');
    }
  
    const currency = 'USD';
    const line_items = order.orderItems.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
  
    const token = crypto.randomBytes(20).toString('hex');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.WEB_URL}/stripe-payment/${orderId}/success?token=${token}`,
      cancel_url: `${process.env.WEB_URL}/stripe-payment/${orderId}/cancel`,
      metadata: {
        order_id: orderId.toString(),
        token,
      },
    });

    await prisma.payment.create({
      data: {
        orderId: orderId,
        amount: order.total,
        paymentStatus: session.payment_status,
        currency,
        token,
        stripePaymentId: session.id,
      },
    });
  
    return session;
  };


  const completePayment = async (orderId, token) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
  
    if (!order) {
      throw createError(404, 'Order not found');
    }
  
    const payment = await prisma.payment.findUnique({
      where: { token },
    });
  
    if (!payment) {
      throw createError(404, 'Payment record not found');
    }
  
    const session = await stripe.checkout.sessions.retrieve(
      payment.stripePaymentId
    );
  
    if (session.payment_status === 'paid') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: session.payment_status,
        },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          orderStatus: 'IN_PROGRESS',
        },
      });
  
      return session;
    }
  
    throw createError(400, 'Payment not completed');
  };
  


module.exports = {
    commitPayment,
    completePayment
};
