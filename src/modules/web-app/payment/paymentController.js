const paymentService = require('./paymentService');

const commitPayment = async (req, res, next) => {
    try {
        const {order_id} = req.body;
        const payment  = await paymentService.commitPayment(order_id);

        return res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

const completePayment = async (req, res, next) => {
    try {
        const {order_id,token} = req.body;
        const payment  = await paymentService.completePayment(order_id,token);

        return res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    commitPayment,
};
