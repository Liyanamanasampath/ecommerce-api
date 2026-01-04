const Order = require('../../../models/order');
const createError = require('http-errors');

const create = async (order) => {
    console.log(order);
    const newOrder = new Order(order);
    return await newOrder.save();
};

const update = async (id, orderData) => {
    const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
    if (!order) {
        throw createError(404, 'Order not found');
    }
    return order;
};

const getById = async (id) => {
    const order = await Order.findById(id);
    if (!order) {
        throw createError(404, 'Order not found');
    }
    return order;
};

const getAll = async (query) => {
    const { title, minPrice, maxPrice, minRating, sort, page = 1, limit = 10 } = query;
    
    const filter = {};

    if (title) {
        filter.title = new RegExp(title, 'i'); 
    }

    filter.price = { $gte: minPrice || 0 };
    if (maxPrice) {
        filter.price.$lte = maxPrice;
    }

    if (minRating) {
        filter['ratings.star'] = { $gte: minRating };
    }

    let sortOption = {};
    if (sort === 'priceLowToHigh') {
        sortOption.price = 1;
    } else if (sort === 'priceHighToLow') {
        sortOption.price = -1;
    } else if (sort === 'latest') {
        sortOption.createdAt = -1;
    } else if (sort === 'oldest') {
        sortOption.createdAt = 1;
    } else if (sort === 'popularity') {
        sortOption.sold = -1; 
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)

    const totalOrders = await Order.countDocuments(filter);

    return { orders, totalOrders, page, limit };
};


const deleteOrder = async (id) => {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
        throw createError(404, 'Order not found');
    }
    return { message: 'Order deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteOrder,
};
