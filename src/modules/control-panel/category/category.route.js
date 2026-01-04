const express = require('express')
const router = express.Router()
const categoryController = require('./categoryController')

router.post('/', categoryController.create);            
router.put('/:id', categoryController.update);         
router.get('/:id', categoryController.show);       
router.get('/', categoryController.index);           
router.delete('/:id', categoryController.destroy);



module.exports = router;