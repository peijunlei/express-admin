const catchAsync = require('../utils/catchAsync')

const Menu = require('../models/Menu');
const Func = require('../models/Func');

exports.getMenuAuth = catchAsync(async (req, res, next) => {
  // 查询所有菜单 (delflag 为 false)
  // 询所有功能
  const [menuAuths, funcAuths] = await Promise.all([
    Menu.find({ delflag: false }).select('id label route parentId type icon order').sort('order'),
    Func
      .find()
      .select('id menuId functionName functionCode order apiIds') // 需要包含 apiIds 字段
      .populate('apis') // 只需要 populate 虚拟字段 apis
      .sort('order') // 排序
  ])
  res.success({
    menus: menuAuths,
    funcs: funcAuths,
  })
})