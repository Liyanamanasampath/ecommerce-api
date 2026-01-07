const { prisma } = require('../../../config/dbConnect');
const Category = require('../../../models/category');
const createError = require('http-errors');

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


module.exports = {
    getById,
    getAll,
};
