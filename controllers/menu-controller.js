
const Const = require('../constant')
const Menu = require('../models/Menu')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


exports.getAllMenus = catchAsync(async (req, res) => {
  const allMenus = await Menu.find() // 查询所有
  const count = await Menu.countDocuments() // 计算总数
  res.success({
    list: allMenus,
    total: count
  })
})
exports.createMenu = factory.createOne(Menu)
exports.updateMenu = factory.updateOne(Menu)
exports.getMenu = factory.getOne(Menu)