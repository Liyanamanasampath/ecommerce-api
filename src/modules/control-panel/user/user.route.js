const express = require('express');
const resource = require('express-resource');
const router = express.Router();
const userController = require('./userController');


router.get('/', userController.index);           
router.post('/',userController.create);      
router.get('/:id',userController.show);    
router.put('/:id',userController.update); 
router.delete('/:id',userController.destroy);

module.exports = router;
