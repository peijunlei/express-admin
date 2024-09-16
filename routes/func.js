const express = require('express')
const router = express.Router()
const { deletefunc, createfunc, updatefunc, getPermissionFuncs } = require('../controllers/func-controller')
const { authGuard } = require('../middleware/auth-middleware')

router
  .route('/')
  .post(createfunc)
router.get('/permission', authGuard, getPermissionFuncs)
router
  .route('/:id')
  .put(updatefunc)
  .delete(deletefunc)
module.exports = router