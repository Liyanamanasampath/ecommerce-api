const Product = require('../../../models/product');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { prisma } = require('../../../config/dbConnect');

//================== create product  ==================================
const create = async (productData, images) => {
    const { title, description, price, quantity, categoryId, slug } = productData;

    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                title,
                description,
                slug,
                price: Number(price),
                quantity: Number(quantity),
                categoryId: Number(categoryId),
            },
        });
        if (images.length > 0) {
            const createdImages = await Promise.all(
                images.map(img =>
                    tx.image.create({
                        data: {
                            url: img.url,
                            fileName: img.fileName,
                        },
                    })
                )
            );
            await tx.productImage.createMany({
                data: createdImages.map(image => ({
                    productId: product.id,
                    imageId: image.id,
                })),
            });
        }
        return product;
    });
};

//================== update product  ==================================
const update = async (
    productId,
    productData,
    existingImageIds,
    newImages
) => {
    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw createError(404, "Product not found");
        }

        await tx.product.update({
            where: { id: productId },
            data: {
                title: productData.title,
                description: productData.description,
                slug: productData.slug,
                price: productData.price ? Number(productData.price) : undefined,
                quantity: productData.quantity ? Number(productData.quantity) : undefined,
                categoryId: productData.categoryId ? Number(productData.categoryId) : undefined,
            },
        });

        await tx.productImage.deleteMany({
            where: {
                productId,
                imageId: {
                    notIn: existingImageIds.length ? existingImageIds : [0],
                },
            },
        });

        if (newImages.length > 0) {
            const createdImages = await Promise.all(
                newImages.map(img =>
                    tx.image.create({
                        data: {
                            url: img.url,
                            fileName: img.fileName,
                        },
                    })
                )
            );

            await tx.productImage.createMany({
                data: createdImages.map(image => ({
                    productId,
                    imageId: image.id,
                })),
            });
        }

        return product;
    });
};

//================== get product by id  ==================================
const getById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
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
        data: products,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};


//================== delete product ==================================
const deleteProduct = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    if (!product) {
        throw createError(404, 'Product not found');
    }
    await prisma.product.delete({
        where: { id }
    });
    return { message: 'Product deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteProduct,
};
