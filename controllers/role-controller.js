
const Const = require('../constant')
const Role = require('../models/Role')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


exports.getAllRoles = catchAsync(async (req, res) => {
  const allRoles = await Role.find().populate(
    // { path: 'menus',select: 'label id' } // 填充权限
  )
  const count = await Role.countDocuments() // 计算总数
  res.success({
    list: allRoles,
    total: count
  })
})
exports.createRole = factory.createOne(Role)
exports.updateRole = factory.updateOne(Role)
exports.getRole = catchAsync(async (req, res) => {
  let role =await Role.findById(req.params.id).select('menus funcs')
  res.success(role)
})
exports.deleteRole = factory.deleteOne(Role)