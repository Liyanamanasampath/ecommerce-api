const Product = require('../../../models/product');
const createError = require('http-errors');
const User = require('../../../models/user');
const { prisma } = require('../../../config/dbConnect');

//================== get product by id  ==================================
const getById = async (id) => {
    const productId = Number(id);
    const product = await prisma.product.findUnique({
        where: { id : productId },
        select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            price: true,
            quantity: true,
            categoryId: true,
            images: {
                select: {
                    image: {
                        select: {
                            url: true,
                            fileName: true
                        }
                    }
                }
            }
        }
    });
    if (!product) {
        throw createError(404, 'Product not found');
    }
    return product;
};

//================== get all product  ==================================
const getAll = async (query) => {
    const { title, minPrice, maxPrice, minRating, sort, page = 1, limit = 10 } = query;

    const where = {};

    if (title) {
        where.title = {
            contains: title,
            mode: 'insensitive',
        };
    }

    if (minPrice || maxPrice) {
        where.price = {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { lte: Number(maxPrice) }),
        };
    }

    let orderBy = {};
    switch (sort) {
        case 'priceLowToHigh':
            orderBy.price = 'asc';
            break;
        case 'priceHighToLow':
            orderBy.price = 'desc';
            break;
        case 'latest':
            orderBy.created_at = 'desc';
            break;
        case 'oldest':
            orderBy.created_at = 'asc';
            break;
        default:
            orderBy.created_at = 'desc';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const products = await prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
            id: true,
            title: true,
            price: true,
            quantity: true,
            created_at: true,
            images: {
                select: {
                    image: {
                        select: {
                            url: true,
                        },
                    },
                },
            },
        },
    });
    const total = await prisma.product.count({ where });
    return {
        data: products?.lenght > 0 ? products : [],
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};

// const addToWishList = async (prodId, userId) => {
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             throw createError(404, 'User not found');
//         }
//         const productExists = user.wishlist.includes(prodId);

//         if (productExists) {
//             user.wishlist = user.wishlist.filter(id => id.toString() !== prodId);
//         } else {
//             user.wishlist.push(prodId);
//         }
//         await user.save();
//         return user;
//     } catch (error) {
//         throw createError(500, error.message);
//     }
// };

// const addRating = async (prodId, star, review, id) => {
//     try {
//         const product = await Product.findById(prodId);
//         if (!product) {
//             throw createError(404, 'product not found');
//         }
//         const obj = {
//             star: star,
//             postedBy: id,
//             review: review
//         }
//         console.log(obj);
//         product.ratings.push(obj);
//         await product.save();
//         return product;
//     } catch (error) {
//         throw createError(500, error.message);
//     }
// };




module.exports = {
    getById,
    getAll,
};
