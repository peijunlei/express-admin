const express = require('express')
const router = express.Router()
const { 
  register, 
  sendCode, 
  registerByCode, 
  login, 
  forgetPassword, 
  resetPassword, 
  updatePassword,
  getUserByToken
} = require('../controllers/auth-controller')
const { authGuard } = require('../middleware/auth-middleware')

router
  .get('/getUserByToken/:token', getUserByToken)
  .post('/sendCode', sendCode)
  .post('/registerByCode', registerByCode)
  .post('/register', register)
  .post('/login', login)
  .post('/forgetPassword', forgetPassword)
  .post('/resetPassword/:token', resetPassword)
  .patch('/updatePassword', authGuard, updatePassword)

module.exports = router 