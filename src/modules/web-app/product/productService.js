const Product = require('../../../models/product');
const createError = require('http-errors');
const User = require('../../../models/user');

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

const addToWishList = async (prodId, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }
        const productExists = user.wishlist.includes(prodId);

        if (productExists) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== prodId);
        } else {
            user.wishlist.push(prodId);
        }
        await user.save();
        return user;
    } catch (error) {
        throw createError(500, error.message);
    }
};

const addRating = async (prodId, star, review, id) => {
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            throw createError(404, 'product not found');
        }
        const obj = {
            star: star,
            postedBy: id,
            review: review
        }
        console.log(obj);
        product.ratings.push(obj);
        await product.save();
        return product;
    } catch (error) {
        throw createError(500, error.message);
    }
};




module.exports = {
    getById,
    getAll,
    addToWishList,
    addRating
};
