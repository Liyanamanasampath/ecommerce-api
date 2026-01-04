const Coupon = require('../../../models/coupon');
const createError = require('http-errors');

const create = async (title,discount) => {
    const existingCoupon = await Coupon.findOne({ title });
    if (existingCoupon) {
        throw createError(400, 'Coupon already exists');
    }

    const code = await generateUniqueCode();

    const newCoupon = new Coupon({ code,title,discount});
    return await newCoupon.save();
};

const generateUniqueCode = async () => {
    let code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
    let existingCoupon = await Coupon.findOne({ code }); 

    while (existingCoupon) {
        code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
        existingCoupon = await Coupon.findOne({ code }); 
    }

    return code;
};

const update = async (id,title,discount) => {
    const coupon = await Coupon.findByIdAndUpdate(id, { title,discount }, { new: true });
    if (!coupon) {
        throw createError(404, 'Coupon not found');
    }
    return coupon;
};

const getById = async (id) => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw createError(404, 'Coupon not found');
    }
    return coupon;
};

const getAll = async () => {
    return await Coupon.find();
};

const deleteCoupon = async (id) => {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        throw createError(404, 'Coupon not found');
    }
    return { message: 'Coupon deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteCoupon,
};
