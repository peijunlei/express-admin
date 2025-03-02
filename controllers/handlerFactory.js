const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/app-error')
const Const = require('../constant')
const APIFeatures = require('../utils/api-features')
const logger = require('../utils/logger')

/**
 * 有delflag字段并查询 delflag 为 0 即未删除的数据,
 */
const queryDelflag = {
  $or: [
    { delflag: { $in: [0, false] } },
    { delflag: { $exists: false } }  // 字段不存在也视为未删除
  ]
}
exports.createOne = Model => catchAsync(async (req, res) => {
  const data = await Model.create({ ...req.body })
  res.success(data)
})
exports.getAll = (Model, options = {}) => catchAsync(async (req, res) => {
  console.log('common query===>', req.query)
  let filter = queryDelflag
  console.log('filter===>', filter)
  const feature = new APIFeatures(
    Model.find(filter)
      .populate(options.populates || []),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields()
  const data = await feature.query
  const total = await Model.countDocuments(Object.assign({}, filter, options))
  const result = {
    list: data,
    // 返回 page 页码 pageNum pageSize
    pageNum: req.query.pageNum * 1 || 1,
    pageSize: req.query.pageSize * 1 || 10,
    total
  }
  res.success(result)
})
// 无分页查询所有
exports.getAllNoPage = Model => catchAsync(async (req, res) => {
  // 查询所有未删除的数据
  const list = await Model.find(queryDelflag)
  const total = await Model.countDocuments(queryDelflag)
  res.success({
    list,
    total
  })
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
exports.delOneByFlag = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, { delflag: true })
  if (!doc) {
    return next(new AppError(Const.RESOURCE_NOT_FOUND))
  }
  res.success(null)
})