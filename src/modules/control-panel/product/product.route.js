const express = require('express')
const router = express.Router()
const productController = require('./productController')
const upload = require('../../../middleware/uploadImages')

router.get('/', productController.index);            
router.post('/' , upload ,productController.create);       
router.get('/:id',productController.show);     
router.put('/:id',productController.update);   
router.delete('/:id',productController.destroy);


module.exports = router;