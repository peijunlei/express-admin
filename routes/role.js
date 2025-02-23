const express = require('express')
const router = express.Router()
const { getAllRoles, getRole, deleteRole, createRole, updateRole } = require('../controllers/role-controller')
const { authGuard } = require('../middleware/auth-middleware')

// 为所有路由添加验证中间件
router.use(authGuard)

router
  .route('/')
  .get(getAllRoles)
  .post(createRole)
router
  .route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole)
module.exports = router