const Category = require('../../../models/category');
const createError = require('http-errors');

const getById = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw createError(404, 'Category not found');
    }
    return category;
};

const getAll = async () => {
    return await Category.find();
};


module.exports = {
    getById,
    getAll,
};
