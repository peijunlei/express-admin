const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, deleteUser, updateUser, addUser } = require('../controllers/user-controller')
const { authGuard, isAdminOrSelf, hasRole } = require('../middleware/auth-middleware')
const { excludeBody } = require('../utils/object-utils')
const { ROLES } = require('../constant/roles')


// 管理员路由
router.route('/')
  .get(authGuard, hasRole(ROLES.ADMIN), getAllUsers)
  .post(authGuard, hasRole(ROLES.ADMIN), addUser)


// 用户自身操作路由
router.route('/:id')
  .get(authGuard, isAdminOrSelf, getUser)
  .put(
    authGuard,
    isAdminOrSelf,
    excludeBody('role', 'password', 'passwordConfirm'),
    updateUser
  )
  .delete(authGuard, hasRole(ROLES.ADMIN), deleteUser)

module.exports = router