const Category = require('../../../models/category');
const createError = require('http-errors');

const create = async (name) => {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        throw createError(400, 'Category already exists');
    }

    const newCategory = new Category({ name, is_active: true });
    return await newCategory.save();
};

const update = async (id, name) => {
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
        throw createError(404, 'Category not found');
    }
    return category;
};

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

const deleteCategory = async (id) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        throw createError(404, 'Category not found');
    }
    return { message: 'Category deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteCategory,
};
