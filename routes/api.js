const express = require('express')
const router = express.Router()
const { getAllApis, getApi, deleteApi, updateApi, addApi, excludeBody } = require('../controllers/api-controller')
const { authGuard } = require('../middleware/auth-middleware')




// need auth
router.use(authGuard)
router
  .route('/')
  .post(addApi)
  .get(getAllApis)
router
  .route('/:id')
  .get(getApi)
  .put(updateApi)
  .delete(deleteApi)

module.exports = router