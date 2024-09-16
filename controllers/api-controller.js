
const Const = require('../constant')
const Api = require('../models/Api')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


exports.getAllApis = factory.getAll(Api)
exports.getApi = factory.getOne(Api)
exports.updateApi = factory.updateOne(Api)
exports.deleteApi = catchAsync(async (req, res) => {
  // 逻辑删除
  const doc = await Api.findByIdAndUpdate(req.params.id, { delflag: 1 })
  // 查询不到 id 不会报错，需要手动抛出错误
  if (!doc) throw new AppError(Const.RESOURCE_NOT_FOUND)
  res.success(null)
})
// addApi
exports.addApi = catchAsync(async (req, res) => {
  const doc = await Api.create(req.body)
  res.success(doc)
})

exports.excludeBody = (...keys) => (req, res, next) => {
  const body = excludeObj(req.body, ...keys)
  req.body = body
  next()
}
function excludeObj(obj, ...excludeKeys) {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (!excludeKeys.includes(key)) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}