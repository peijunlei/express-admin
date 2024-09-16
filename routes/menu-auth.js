const express = require('express')
const router = express.Router()
const { getMenuAuth } = require('../controllers/menu-auth-controller')

router
  .route('/')
  .get(getMenuAuth)
module.exports = router