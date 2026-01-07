const productService = require('./productService');

const index = async (req, res, next) => {
    try {
        const { products, totalProducts, page, limit } = await productService.getAll(req?.query);
        return res.status(200).json({
            products,
            pagination: {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        next(error);
    }
}; 

const create = async (req, res, next) => {
    try {
        const productData = req.body;
        const images = req.files.map(file => file.path);
        const products  = await productService.create({
            ...productData
        });

        return res.status(201).json(products);
    } catch (error) {
        next(error);
    }
};

const show = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await productService.getById(id);
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    const { id } = req.params;
    const productData  = req.body;
    try {
        const updatedproduct = await productService.update(id, productData);
        if (!updatedproduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        return res.status(200).json(updatedproduct);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedproduct = await productService.deleteProduct(id);
        if (!deletedproduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        return res.status(201).send({ success: true });
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
