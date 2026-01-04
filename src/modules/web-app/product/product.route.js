const express = require('express')
const router = express.Router()
const productController = require('./productController')
const {authMiddleware} = require('../../../middleware/authMiddleware')

router.get('/', productController.index);               
router.get('/:id',productController.show);    
router.post('/wishlist',authMiddleware,productController.addToWishList);
router.post('/rating',authMiddleware,productController.addRating);


module.exports = router;