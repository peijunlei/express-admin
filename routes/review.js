const express = require('express')
const { getAllReviews, getReview, deleteReview, createReview, updateReview } = require('../controllers/review-controller')
const { authGuard } = require('../middleware/auth-middleware')

const router = express.Router({ mergeParams: true })



router
  .route('/')
  .get(getAllReviews)
  .post(authGuard, createReview)
router
  .route('/:id')
  .get(getReview)
  .patch(authGuard, updateReview)
  .delete(authGuard, deleteReview)


module.exports = router