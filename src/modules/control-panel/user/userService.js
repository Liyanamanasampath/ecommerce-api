const User = require('../../../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { prisma } = require('../../../config/dbConnect');

//================== create user  ==================================
const create = async (email, firstName, lastName, mobile, role, password) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw createError(400, 'User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            mobile,
            role,
            password: hashedPassword
        }
    })
    return newUser;
};

//================== update user  ==================================
const update = async (id, email, firstname, lastname, mobile, role) => {
    const existingUser = await prisma.user.findUnique({
        where: { id }
    });
    if (!existingUser) {
        throw createError(400, 'User not found');
    }

    const user = await prisma.user.update({
        where: { id },
        data: {
            firstname,
            lastname,
            mobile,
            role,
        }
    });
    return user;
};

//================== get user by id  ==================================
const getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            role: true
        }
    });
    if (!user) {
        throw createError(404, 'User not found');
    }
    return user;
};

//================== get all users ==================================
const getAll = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            role: true
        }
    });
};

//================== delete user ==================================
const deleteUser = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw createError(404, 'User not found');
    }
    await prisma.user.delete({
        where: { id },
    });
    return { message: 'User deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteUser,
};
