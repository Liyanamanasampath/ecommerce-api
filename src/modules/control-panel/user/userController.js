const userService = require('./userService');

const index = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const { email, firstname, lastname,mobile, role,password} = req.body;
    try {
        const user = await userService.create(email, firstname, lastname,mobile, role,password);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log(id);
        const user = await userService.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const { id } = req.params;
    const { email, firstname, lastname,mobile, role,password} = req.body;
    try {
        const updateduser = await userService.update(id,email, firstname, lastname,mobile, role,password);
        if (!updateduser) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json(updateduser);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteduser = await userService.deleteuser(id);
        if (!deleteduser) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(204).send({success : true});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
};
