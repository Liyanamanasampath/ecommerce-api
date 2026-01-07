const express = require('express')
const router = express.Router()
const categoryController = require('./categoryController')
const validate = require('../../../middleware/validate')
const categoryValidate = require('../../../validator/validateCategory')

router.post('/', validate(categoryValidate) ,categoryController.create);           
router.put('/:id',validate(categoryValidate), categoryController.update);         
router.get('/:id', categoryController.show);       
router.get('/', categoryController.index);           
router.delete('/:id', categoryController.destroy);



module.exports = router;