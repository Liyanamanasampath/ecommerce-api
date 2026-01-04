const authService = require('./authService')

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const service = await authService.login(email, password,res);
        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    const { email, firstname, lastname,mobile,role, password, confirm_password } = req.body;
    try {
        const service = await authService.register(email,  firstname, lastname,mobile, role,password, confirm_password);
        return res.status(201).json(service);
    } catch (error) {
        next(error);
    }
};

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const service = await authService.forgetPassword(email);
        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    const {token, password, confirm_password } = req.body;
    try {
        const service = await authService.resetPassword(token,password, confirm_password);
        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const service = await authService.logout();
        return res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    forgetPassword,
    resetPassword,
    logout,
};
