const express = require('express')
const router = express.Router()
const productController = require('./productController')
const upload = require('../../../middleware/uploadImages');
const validate = require('../../../middleware/validate');
const productDto = require('../../../validator/validateProduct');

router.get('/', productController.index);            
router.post('/' , validate(productDto),upload ,productController.create);       
router.get('/:id',productController.show);     
router.put('/:id',validate(productDto),upload,productController.update);   
router.delete('/:id',productController.destroy);


module.exports = router;