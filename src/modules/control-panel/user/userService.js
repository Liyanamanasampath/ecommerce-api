const User = require('../../../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const create = async (email, firstname, lastname,mobile, role,password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(400, 'User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, firstname, lastname,mobile, role,password: hashedPassword });
    return await newUser.save();
};

const update = async (id, email, firstname, lastname,mobile, role,password) => {
    const user = await User.findByIdAndUpdate(id, { email, firstname, lastname,mobile, role,password }, { new: true });
    if (!user) {
        throw createError(404, 'User not found');
    }
    return user;
};

const getById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw createError(404, 'User not found');
    }
    return user;
};

const getAll = async () => {
    return await User.find();
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw createError(404, 'User not found');
    }
    return { message: 'User deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteUser,
};
