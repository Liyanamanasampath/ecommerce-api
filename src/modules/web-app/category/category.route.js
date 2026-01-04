const express = require('express')
const router = express.Router()
const categoryController = require('./categoryController')
     
router.get('/:id', categoryController.show);       
router.get('/', categoryController.index);           


module.exports = router;