const productService = require('./productService');

const index = async (req, res, next) => {
    try {
        const data = await productService.getAll(req?.query);
        return res.status(200).json(data);
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

// const addToWishList = async (req,res,next) =>{
//     try {
//         const  {prodId} = req?.body
//         const {id} = req.user
//         const product = await productService.addToWishList(prodId,id);
//         return res.status(200).json(product);
//     } catch (error) {
//        next(error); 
//     }
// }

// const addRating = async (req,res,next) =>{
//     try {
//         const  {prodId,star,review} = req?.body
//         const {id} = req?.user
//         const product = await productService.addRating(prodId,star,review,id);
//         return res.status(200).json(product);
//     } catch (error) {
//        next(error); 
//     }
// }



module.exports = {
    index,
    show,
};
