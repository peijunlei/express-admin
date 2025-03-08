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
  
  if (!roleIds?.length) {
    return res.success({ list: [], total: 0 })
  }

  const roles = await Role.find(
    { 
      _id: { $in: roleIds },
      disabled: false // 只查询未禁用的角色
    },
    { menus: 1 }
  ).populate({
    path: 'menus',
    match: {
      $or: [
        { delflag: false },
        { delflag: null }
      ]
    }
  });

  // 使用 Set 对象去重
  const uniqueMenus = Array.from(
    new Set(
      roles.flatMap(role => role.menus)
        .filter(menu => menu)
    )
  );
  
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