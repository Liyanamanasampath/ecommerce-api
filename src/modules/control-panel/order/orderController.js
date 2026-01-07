const orderService = require('./orderService');

const index = async (req, res, next) => {
    try {
        const orders = await orderService.getAll(req?.query);
        return res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}; 

// const create = async (req, res, next) => {
//     try {
//         const orderData = req.body;
//         const order  = await orderService.create(orderData);

//         return res.status(201).json(order);
//     } catch (error) {
//         next(error);
//     }
// };

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await orderService.getById(id);
        if (!order) {
            return res.status(404).json({ message: 'order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// const update = async (req, res, next) => {
//     const { id } = req.params;
//     const orderData  = req.body;
//     try {
//         const updatedorder = await orderService.update(id, orderData);
//         if (!updatedorder) {
//             return res.status(404).json({ message: 'order not found' });
//         }
//         return res.status(200).json(updatedorder);
//     } catch (error) {
//         next(error);
//     }
// };

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedorder = await orderService.deleteOrder(id);
        if (!deletedorder) {
            return res.status(404).json({ message: 'order not found' });
        }
        return res.status(201).send({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    index,
    show,
    destroy,
};
