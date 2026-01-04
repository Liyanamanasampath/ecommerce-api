const express = require('express');
const router = express.Router();
const blogController = require('./blogController');


router.get('/', blogController.index);           
router.post('/',blogController.create);      
router.get('/:id',blogController.show);    
router.put('/:id',blogController.update); 
router.delete('/:id',blogController.destroy);

module.exports = router;
