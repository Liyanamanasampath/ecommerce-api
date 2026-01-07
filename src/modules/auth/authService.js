const { prisma } = require('../../config/dbConnect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const sendMail = require('../../config/mailService');
const { generateRefreshToken } = require('../../config/refreshToken');



const login = async (email, password, res) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw createError(400, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(400, 'Invalid credentials');
    }

    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = await generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    });

    return {
        access_token: accessToken,
        token_type: 'Bearer',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    };
};



const register = async (
    email,
    firstName,
    lastName,
    mobile,
    role,
    password,
    confirm_password
) => {
    if (password != confirm_password) {
        throw createError(400, 'Passwords do not match');
    }

    const exists = await prisma.user.findUnique({
        where: { email },
    });

    if (exists) {
        throw createError(400, 'User already exists with this email');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            mobile,
            role,
            password: hashedPassword,
        },
    });

    return { user: newUser };
};


const forgetPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { message: 'Reset link sent successfully' };
    }

    const expiresIn = Number(process.env.PSWD_EXPIRES_IN);

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    await prisma.user.update({
        where: { id: user.id },
        data: {
            pwd_reset_token: token,
            reset_token_exp_at: new Date(Date.now() + expiresIn * 1000),
        },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const htmlPath = path.join(__dirname, '..', '..', '..', 'src', 'email', 'reset-password.html');

    let html = fs.readFile(htmlPath, 'utf8');
    html = html.replace('{{logoUrl}}', process.env.API_ASSET_URL);
    html = html.replace('{{resetLink}}', resetLink);

    await sendMail(email, 'Password Reset Request', html);

    return { message: 'Reset link sent successfully' };
};


const resetPassword = async (token, password, confirm_password) => {
    if (password !== confirm_password) {
        throw createError(400, 'Passwords do not match');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw createError(400, 'Invalid or expired reset token');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: decoded.id,
            pwd_reset_token: token,
        },
    });

    if (!user) {
        throw createError(404, 'Invalid or expired reset token');
    }

    if (user.reset_token_exp_at < new Date()) {
        throw createError(400, 'Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            pwd_reset_token: null,
            reset_token_exp_at: null,
        },
    });

    return { message: 'Password reset successfully' };
};


const logout = async (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
    });

    return { message: 'User logged out successfully' };
};

module.exports = { login, register, forgetPassword, resetPassword, logout };