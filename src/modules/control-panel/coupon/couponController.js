const couponService = require('./couponService');

const index = async (req, res, next) => {
    try {
        const coupons = await couponService.getAll();
        return res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const {  title,discount } = req.body;
    try {
        const coupon = await couponService.create(title,discount);
        return res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const coupon = await couponService.getById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'coupon not found' });
        }
        return res.status(200).json(coupon);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const { id } = req.params;
    const { title,discount } = req.body;
    try {
        const updatedcoupon = await couponService.update(id,title,discount);
        if (!updatedcoupon) {
            return res.status(404).json({ message: 'coupon not found' });
        }
        return res.status(200).json(updatedcoupon);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedcoupon = await couponService.deletecoupon(id);
        if (!deletedcoupon) {
            return res.status(404).json({ message: 'coupon not found' });
        }
        return res.status(204).send({success : true});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
};
