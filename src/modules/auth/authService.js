const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path')
const sendMail = require('../../config/mailService')
const {generateRefreshToken} = require('../../config/refreshToken')


const login = async (email, password, res) => {
    try {
        const user = await User.findOne({ email }).populate('wishlist');
        console.log(user);
        if (!user || !(await user.isPasswordMatch(password))) {
            throw createError(400, 'Invalid credentials or email not verified');
        }

        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = await generateRefreshToken(user.id);
        const updateUser = await User.findByIdAndUpdate(user.id, { refreshToken }, { new: true });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000 // 72 hours
        });

        return {
            access_token: token,
            token_type: 'Bearer',
            user: {
                id: user.id,
                name: user.firstname,
                email: user.email,
                wishlist: user.wishlist || [],
            },
        };
    } catch (error) {
        throw error;
    }
};


const register = async (email,firstname, lastname,mobile,role,password,confirm_password) => {
    try {
        const user = await User.findOne({ email : email })
        if(user){
            throw createError(400,'user alreday exist with email')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, firstname, lastname,mobile, role,password: hashedPassword });
        await newUser.save();

        return {user : newUser};
    } catch (error) {
        throw error;
    }
}

const forgetPassword = async (email) => {
    try {
        const user = await User.findOne({email});
        if(user){
            const expiresIn = process.env.PSWD_EXPIRES_IN ;
            const token = jwt.sign(
                { id: user?._id },
                process.env.JWT_SECRET,
                { expiresIn: expiresIn }
              );
            const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresIn;
            user.pwd_reset_token = token;
            user.reset_token_exp_at = expirationTimestamp;
            user.save();

            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
            const htmlPath = path.join(__dirname,'..','..','..','src','email','reset-password.html');
            let html = fs.readFileSync(htmlPath,'utf8');
            html = html.replace('{{logoUrl}}',`${process.env.API_ASSET_URL}`);
            html = html.replace('{{resetLink}}',resetLink);
            await sendMail(   
                email,
                'Password Reset Request',
                html
            )
        }
        return { message: 'Reset Link Sent successful' };
    } catch (error) {
        throw error;
    }
}

const resetPassword = async (token, password, confirm_password) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded.id, pwd_reset_token: token });
        if (!user) {
            throw createError(404, 'Invalid or expired reset token');
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (user.reset_token_exp_at < currentTimestamp) {
            throw createError(400, 'Reset token has expired');
        }

        if (password != confirm_password) {
            throw createError(400, 'Passwords do not match');
        }

        user.password = await bcrypt.hash(password,10);
        user.pwd_reset_token = null;
        user.reset_token_exp_at = null;
        user.save();

        return { message: 'Password has been reset successfully' };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw createError(400, 'Reset token has expired');
        }
        throw error;
    }
}

const logout = async (req,res) => {
    try {
        return { message: 'user logout successfully' };
    } catch (error) {
        throw error;
    }
}

module.exports = {login,register,forgetPassword,resetPassword,logout};