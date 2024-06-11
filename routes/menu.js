const express = require('express')
const router = express.Router()
const { getAllMenus, getMenu, createMenu, updateMenu } = require('../controllers/menu-controller')
const { authGuard } = require('../middleware/auth-middleware')


router
  .route('/')
  .get(authGuard, getAllMenus)
  .post(createMenu)
router
  .route('/:id')
  .get(authGuard, getMenu)
  .put(updateMenu)
module.exports = router