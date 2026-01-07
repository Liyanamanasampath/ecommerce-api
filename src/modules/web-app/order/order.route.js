const express = require('express')
const router = express.Router()
const orderController = require('./orderController');
const validate = require('../../../middleware/validate');
const orderDto = require('../../../validator/validateOrder');

router.get('/', orderController.index);           
router.post('/' ,validate(orderDto)  ,orderController.create);       
router.get('/:id',orderController.show);
router.put('/:id',orderController.update);   
router.delete('/:id',orderController.destroy);


module.exports = router;