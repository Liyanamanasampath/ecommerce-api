const Product = require('../../../models/product');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const create = async (product) => {
    console.log(product);
    const newProduct = new Product(product);
    return await newProduct.save();
};

const update = async (id, productData) => {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!product) {
        throw createError(404, 'Product not found');
    }
    return product;
};

const getById = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw createError(404, 'Product not found');
    }
    return product;
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

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)

    const totalProducts = await Product.countDocuments(filter);

    return { products, totalProducts, page, limit };
};


const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        throw createError(404, 'Product not found');
    }
    return { message: 'Product deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteProduct,
};
