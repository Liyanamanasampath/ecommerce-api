const blogService = require('./blogService');

const index = async (req, res, next) => {
    try {
        const blogs = await blogService.getAll();
        return res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const blogData = req.body;
    try {
        const blog = await blogService.create(blogData);
        return res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const blog = await blogService.getById(id);
        if (!blog) {
            return res.status(404).json({ message: 'blog not found' });
        }
        return res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const { id } = req.params;
    const blogData = req.body;
    try {
        const updatedblog = await blogService.update(id,blogData);
        if (!updatedblog) {
            return res.status(404).json({ message: 'blog not found' });
        }
        return res.status(200).json(updatedblog);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedblog = await blogService.deleteBlog(id);
        if (!deletedblog) {
            return res.status(404).json({ message: 'blog not found' });
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
