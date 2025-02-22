const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, deleteUser, updateUser, addUser } = require('../controllers/user-controller')
const { authGuard, isAdminOrSelf, hasRole } = require('../middleware/auth-middleware')
const { excludeBody } = require('../utils/object-utils')
const { ROLES } = require('../constant/roles')

// 通用中间件
router.use(authGuard)

// 管理员路由
router.route('/')
  .get(hasRole(ROLES.ADMIN), getAllUsers)
  .post(hasRole(ROLES.ADMIN), addUser)

// 为 /:id 路径添加通用中间件
// router.use('/:id', isAdminOrSelf)

// 用户自身操作路由
router.route('/:id')
  .get(isAdminOrSelf,getUser)
  .put(
    isAdminOrSelf,
    excludeBody('role', 'password', 'passwordConfirm'),
    updateUser
  )
  .delete(hasRole(ROLES.ADMIN),deleteUser)

module.exports = router