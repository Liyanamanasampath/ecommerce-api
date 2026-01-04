const express = require('express')
const router = express.Router()
const couponController = require('./couponController')

router.post('/', couponController.create);            
router.put('/:id', couponController.update);         
router.get('/:id', couponController.show);       
router.get('/', couponController.index);           
router.delete('/:id', couponController.destroy);

module.exports = router;