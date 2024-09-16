
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
  // 查找多个角色的权限菜单
  const roles = await Role.find({ _id: { $in: roleIds } }).populate('menus');

  // 合并所有角色的菜单
  const allMenus = roles.reduce((acc, role) => {
    return acc.concat(role.menus);
  }, []);
  // 去重，防止重复菜单
  const uniqueMenuIds = Array.from(new Set(allMenus.map(menu => menu._id)))
  const uniqueMenus = uniqueMenuIds
    .map(id => allMenus.find(menu => menu._id.equals(id)));
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