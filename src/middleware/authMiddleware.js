const createHttpError = require('http-errors');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        let token;
        if (req?.headers?.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(createHttpError(401, 'Unauthorized'));
        }
        if(token){
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id); 
            req.user = user; 
            next(); 
        }
       
    } catch (error) {
        next(createHttpError(401, 'Unauthorized')); 
    }
};

const isAdmin = async (req,res,next) =>{
    try {
        const {role,email} = req?.user
        if(role == 'admin'){
            next();
        }else{
            return next(createHttpError(401 ,'Unauthorized ,you are not access'))
        }
    } catch (error) {
        next(createHttpError(401, 'Unauthorized')); 
    }
}

module.exports = {authMiddleware,isAdmin};
