const express = require('express')
const router = express.Router()
const paymentController = require('./paymentController')
          
router.post('/commit'  ,paymentController.commitPayment);      
router.post('/complete'  ,paymentController.completePayment);     

module.exports = router;