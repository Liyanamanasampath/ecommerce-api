const categoryService = require('./categoryService');

const index = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const { name } = req.body;
    try {
        const category = await categoryService.create(name);
        return res.status(201).json(category);
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

const update = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await categoryService.update(id, name);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCategory = await categoryService.deleteCategory(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
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
