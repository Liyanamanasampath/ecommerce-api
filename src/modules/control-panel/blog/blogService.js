const Blog = require('../../../models/blog');
const createError = require('http-errors');

const create = async (blogData) => {
    const newBlog = new Blog(blogData);
    return await newBlog.save();
};

const update = async (id, blogData) => {
    const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!blog) {
        throw createError(404, 'Blog not found');
    }
    return blog;
};

const getById = async (id) => {
    const blog = await Blog.findById(id);
    if (!blog) {
        throw createError(404, 'Blog not found');
    }
    return blog;
};

const getAll = async () => {
    return await Blog.find();
};

const deleteBlog = async (id) => {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw createError(404, 'Blog not found');
    }
    return { message: 'Blog deleted successfully' };
};

module.exports = {
    create,
    update,
    getById,
    getAll,
    deleteBlog,
};
