const express = require('express')
const router = express.Router()
const { getAllApis, getApi, deleteApi, updateApi, addApi, excludeBody } = require('../controllers/api-controller')
const { authGuard } = require('../middleware/auth-middleware')




// need auth
// router.use(authGuard)
router
  .route('/')
  .post(addApi)
  .get(authGuard, getAllApis)
router
  .route('/:id')
  .get(authGuard, getApi)
  .put(
    authGuard, updateApi)
  .delete(authGuard, deleteApi)

module.exports = router