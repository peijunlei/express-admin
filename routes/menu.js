const express = require('express')
const router = express.Router()
const { getAllMenus,getPermissionMenus, getMenu, createMenu, updateMenu,deleteMenu } = require('../controllers/menu-controller')
const { authGuard,validatePermission } = require('../middleware/auth-middleware')


router
  .route('/')
  .get(authGuard, getAllMenus)
  .post(createMenu)
router.get('/permission', authGuard, getPermissionMenus)
router
  .route('/:id')
  .get(authGuard, getMenu)
  .put(updateMenu)
  .delete(deleteMenu)
module.exports = router