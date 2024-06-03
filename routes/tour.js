const express = require('express')
const router = express.Router()
const { getAllTours, getTour, deleteTour, createTour, updateTour } = require('../controllers/tour-controller')
const reviewRouter = require('./review')


router.use('/:tourId/reviews', reviewRouter)
router
  .route('/')
  .get(getAllTours)
  .post(createTour)

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router