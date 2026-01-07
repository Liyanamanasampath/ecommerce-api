const { prisma } = require('../../../config/dbConnect');
const Order = require('../../../models/order');
const createError = require('http-errors');

// const create = async (order) => {
//     console.log(order);
//     const newOrder = new Order(order);
//     return await newOrder.save();
// };

// const update = async (id, orderData) => {
//     const order = await Order.findByIdAndUpdate(id, orderData, { new: true });
//     if (!order) {
//         throw createError(404, 'Order not found');
//     }
//     return order;
// };

const getById = async (id) => {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        total: true,
        tax: true,
        subTotal: true,
        orderStatus: true,
        paymentStatus: true,
        created_at: true,
        orderItems: {
          select: {
            id: true,
            price: true,
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: {
                    image: {
                      select: {
                        url: true,
                        fileName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            paymentStatus: true,
            stripePaymentId: true,
          },
        },
      },
    });
  
    if (!order) {
      throw createError(404, 'Order not found');
    }

    return {
      ...order,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        price: item.price,
        product: {
          ...item.product,
          images: item.product.images.map(i => i.image),
        },
      })),
    };
  };

  const getAll = async (query) => {
    const {
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = query;
  
    const where = {};
    if (minPrice || maxPrice) {
      where.total = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }
  
    let orderBy = { created_at: 'desc' };
    switch (sort) {
      case 'priceLowToHigh':
        orderBy = { total: 'asc' };
        break;
      case 'priceHighToLow':
        orderBy = { total: 'desc' };
        break;
      case 'latest':
        orderBy = { created_at: 'desc' };
        break;
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }
  
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const orders = await prisma.order.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        total: true,
        orderStatus: true,
        paymentStatus: true,
        created_at: true,
        orderItems: {
          select: {
            id: true,
          },
        },
        payment: {
          select: {
            paymentStatus: true,
            amount: true,
          },
        },
      },
    });
    const totalOrders = await prisma.order.count({ where });
    return {
      orders,
      pagination: {
        total: totalOrders,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  };
  


const deleteOrder = async (id) => {
    const order = await prisma.order.findUnique({where : {id}});
    if (!order) {
        throw createError(404, 'Order not found');
    }
    await prisma.order.delete({where : {id}});
    return { message: 'Order deleted successfully' };
};

module.exports = {
    getById,
    getAll,
    deleteOrder,
};
