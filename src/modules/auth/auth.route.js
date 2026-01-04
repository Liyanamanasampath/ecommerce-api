const express = require('express')
const router = express.Router()
const authController = require('./authController')

router.post('/login',authController.login)
router.post('/register',authController.register)
router.post('/forgot-password',authController.forgetPassword)
router.post('/reset-password',authController.resetPassword)
router.post('/logout',authController.logout)


module.exports = router;