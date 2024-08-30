
const Const = require('../constant')
const Menu = require('../models/Menu')
const Role = require('../models/Role')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const { getRole } = require('./role-controller')


exports.getAllMenus = factory.getAllNoPage(Menu)
exports.createMenu = factory.createOne(Menu)
exports.updateMenu = factory.updateOne(Menu)
exports.getMenu = factory.getOne(Menu)
exports.deleteMenu = factory.delOneByFlag(Menu)
exports.getPermissionMenus = catchAsync(async (req, res, next) => {
  const { roleIds } = req.user
  console.log('roleIds===>', roleIds)
  const result = await Role.findById(roleIds[0]).populate('menus')
  res.success({
    list: result.menus,
    total: result.menus.length
  })
})
exports.getFunctionNames = catchAsync(async (req, res, next) => {
  // 只查询 type 为  3 的数据 
  const queryDelflag = {
    $or: [
      { delflag: false },
      { delflag: null }
    ]
  }
  const menus = await Menu.find({
    type: 3,
    ...queryDelflag
  })
  res.success({
    list: menus,
    total: menus.length
  })
})