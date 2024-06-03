const express = require('express')
const router = express.Router()
const { getAllMenus, createMenu } = require('../controllers/menu-controller')



router
  .route('/')
  .get(getAllMenus)
  .post(createMenu)

module.exports = router