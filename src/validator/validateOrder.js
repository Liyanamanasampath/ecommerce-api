const {z} = require('zod');

const orderDto  = z.object({
    subTotal : z.number().nonnegative(),
    orderItems : z.array(z.object({
        productId : z.number().int(),
        quantity : z.number().int().positive(),
        price : z.number().nonnegative(),
    })).nonempty(),
})
module.exports = orderDto;