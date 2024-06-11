const express = require('express')
const router = express.Router()
const { getAllRoles, getRole,deleteRole, createRole, updateRole } = require('../controllers/role-controller')
const { authGuard } = require('../middleware/auth-middleware')


router
  .route('/')
  .get(authGuard, getAllRoles)
  .post(createRole)
router
  .route('/:id')
  .get(authGuard, getRole)
  .put(authGuard,updateRole)
  .delete(authGuard, deleteRole)
module.exports = router