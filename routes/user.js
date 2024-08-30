const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, deleteUser, updateUser,addUser, excludeBody } = require('../controllers/user-controller')
const { register, sendCode, registerByCode, login, forgetPassword, resetPassword, updatePassword } = require('../controllers/auth-controller')
const { authGuard, restrictTo, isSelf, validatePermission } = require('../middleware/auth-middleware')



router
  .post('/add', addUser)
  .post('/sendCode', sendCode)
  .post('/registerByCode', registerByCode)
  .post('/register', register)
  .post('/login', login)
  .post('/forgetPassword', forgetPassword)
  .patch('/resetPassword/:token', resetPassword)
  .patch('/updatePassword', authGuard, updatePassword)

// need auth
// router.use(authGuard)
router
  .route('/')
  .get(authGuard, validatePermission, restrictTo('admin'), getAllUsers)
router
  .route('/:id')
  .get(authGuard, isSelf, getUser)
  .put(
    authGuard,
    isSelf,
    // req.body过滤掉role，password，passwordConfirm 三个字段
    excludeBody('role', 'password', 'passwordConfirm'),
    updateUser
  )
  .delete([authGuard, restrictTo('admin')], deleteUser)

module.exports = router