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
        const images = req.files
            ? req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
            }))
            : [];

        const product = await productService.create(productData, images);

        return res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
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
    try {
      const productId = Number(req.params.id);
      const productData = req.body;
      const existingImageIds = productData.existingImageIds
        ? productData.existingImageIds.map(Number)
        : [];
  
      const newImages = req.files
        ? req.files.map(file => ({
            url: file.path,
            fileName: file.filename,
          }))
        : [];
  
      const product = await productService.update(
        productId,
        productData,
        existingImageIds,
        newImages
      );
  
      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
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
