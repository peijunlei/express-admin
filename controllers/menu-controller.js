
const Const = require('../constant')
const Menu = require('../models/Menu')
const Role = require('../models/Role')
const Func = require('../models/Func')
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
  // 查找登录用户的所有角色
  if (!roleIds?.length) {
    return res.success({ list: [], total: 0 })
  }
  const roles = await Role.find(
    { _id: { $in: roleIds } },
    { menus: 1 }  // 只获取需要的字段
  ).populate('menus');
  // 使用 Set 对象直接存储 Menu 对象，避免二次查找
  const uniqueMenus = [...new Set(
    roles.flatMap(role => role.menus)
      .filter(menu => menu) // 过滤掉可能的 null 值
  )];
  
  res.success({
    list: uniqueMenus,
    total: uniqueMenus.length
  });
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

// 交换菜单排序
exports.exchangeOrder = catchAsync(async (req, res, next) => {
  const { id, targetId } = req.body
  const menu = await Menu.findById(id)
  const targetMenu = await Menu.findById(targetId)
  if (!menu || !targetMenu) {
    return next(new AppError('菜单不存在', 400))
  }
  const tempOrder = menu.order
  menu.order = targetMenu.order
  targetMenu.order = tempOrder
  await menu.save()
  await targetMenu.save()
  res.success()
})