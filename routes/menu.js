const express = require('express')
const router = express.Router()
const { getAllMenus, getPermissionMenus, getMenu, createMenu, updateMenu, deleteMenu,exchangeOrder } = require('../controllers/menu-controller')
const { authGuard, validatePermission } = require('../middleware/auth-middleware')

router.use(authGuard)
router
  .route('/')
  .get(getAllMenus)
  .post(createMenu)
// 根据角色获取权限菜单
router.get('/permission', getPermissionMenus)
router
  .route('/:id')
  .get(getMenu)
  .put(updateMenu)
  .delete(deleteMenu)
router
  .post('/exchangeOrder',exchangeOrder)
module.exports = router