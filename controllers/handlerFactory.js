
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/app-error')
const Const = require('../constant')
const APIFeatures = require('../utils/api-features')


exports.createOne = Model => catchAsync(async (req, res) => {
  const data = await Model.create({...req.body})
  res.success(data)
})
exports.getAll = (Model, options) => catchAsync(async (req, res) => {
  console.log('req.user===>', req.user)
  let filter = {}
  if (req.params.tourId) {
    filter = { tour: req.params.tourId }
  }
  const feature = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields()
  const data = await feature.query
  const total = await Model.countDocuments(Object.assign({}, filter, options))
  const result = {
    list: data,
    // 返回 page 页码 pageNum pageSize
    pageNum: req.query.page * 1 || 1,
    pageSize: req.query.limit * 1 || 10,
    total
  }
  res.success(result)
})
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id)
  if (popOptions) query = query.populate(popOptions)
  const doc = await query
  if (!doc) {
    return next(new AppError(Const.RESOURCE_NOT_FOUND))
  }
  res.success(doc)
})
exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!doc) {
    return next(new AppError(Const.RESOURCE_NOT_FOUND))
  }
  res.success(doc)
})
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id)
  if (!doc) {
    return next(new AppError(Const.RESOURCE_NOT_FOUND))
  }
  res.success(null)
})