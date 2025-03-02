const Const = require('../constant')
const User = require('../models/User')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const { excludeBody } = require('../utils/object-utils')

exports.getAllUsers = factory.getAll(User, {
  populates: [{
    path: 'roles',
    select: 'name'
  }]
})
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = catchAsync(async (req, res) => {
  // 逻辑删除
  const user = await User.findByIdAndUpdate(req.params.id, { delflag: 1 })
  // 查询不到 id 不会报错，需要手动抛出错误
  if (!user) throw new AppError(Const.RESOURCE_NOT_FOUND)
  res.success(null)
})
// addUser
exports.addUser = catchAsync(async (req, res) => {
  // 使用 save
  const user = new User(req.body)
  await user.save()
  res.success(user)
})

exports.excludeBody = excludeBody