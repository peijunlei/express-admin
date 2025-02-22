const express = require('express')
const router = express.Router()
const { 
  register, 
  sendCode, 
  registerByCode, 
  login, 
  forgetPassword, 
  resetPassword, 
  updatePassword 
} = require('../controllers/auth-controller')
const { authGuard } = require('../middleware/auth-middleware')

router
  .post('/sendCode', sendCode)
  .post('/registerByCode', registerByCode)
  .post('/register', register)
  .post('/login', login)
  .post('/forgetPassword', forgetPassword)
  .patch('/resetPassword/:token', resetPassword)
  .patch('/updatePassword', authGuard, updatePassword)

module.exports = router 