const { prisma } = require('../../../config/dbConnect');
const Category = require('../../../models/category');
const createError = require('http-errors');

//================== create category  ==================================
const create = async (name) => {
    const existingCategory = await prisma.category.findUnique({ where: { name } })
    if (existingCategory) {
        throw createError(400, 'Category already exists');
    }
    const newCategory = await prisma.category.create({ data: { name, is_active: true, } });
    return newCategory;
};

//================== update category  ==================================
const update = async (id, name) => {
    const existingCategory = await prisma.category.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        throw createError(404, 'Category not found');
    }

    const duplicateName = await prisma.category.findFirst({
        where: {
            name,
            NOT: { id },
        },
    });

    if (duplicateName) {
        throw createError(400, 'Category name already exists');
    }

    const category = await prisma.category.update({
        where: { id },
        data: { name }
    });
    return category;
};

//=================== get category by id ==================================
const getById = async (id) => {
    const category = await prisma.category.findUnique({ 
        where: { id }, 
        select :{
            name : true,
            is_active : true
        }
    });
    if (!category) {
        throw createError(404, 'Category not found');
    }
    return category;
};

//=================== get category list ==================================
const getAll = async () => {
    return await prisma.category.findMany({
        where : {
            ...(company_id && {company_id}),
            is_active : true
        },
        select : {
            name  :true,
            is_active :  true
        },
        orderBy : { 
            created_at : 'desc' 
        }
    });
};

//=================== delete category  ==================================
const deleteCategory = async (id) => {
    const category = await prisma.category.findUnique({
        where : {id}
    });
    if (!category) {
        throw createError(404, 'Category not found');
    }
    await prisma.category.delete({
        where: { id },
    });
    
    return { message: 'Category deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteCategory,
};
