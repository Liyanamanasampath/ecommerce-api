const categoryService = require('./categoryService');

const index = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await categoryService.getById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    index,
    show,
};
