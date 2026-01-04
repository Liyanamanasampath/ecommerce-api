const express = require('express')
const router = express.Router()
const orderController = require('./orderController')

router.get('/', orderController.index);           
router.post('/'  ,orderController.create);       
router.get('/:id',orderController.show);
router.put('/:id',orderController.update);   
router.delete('/:id',orderController.destroy);


module.exports = router;