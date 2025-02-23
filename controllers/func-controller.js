const Func = require('../models/Func')
const Role = require('../models/Role')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


exports.createfunc = factory.createOne(Func)
exports.updatefunc = factory.updateOne(Func)
exports.deletefunc = factory.deleteOne(Func)
/**
 * 获取角色的功能合集
 */
exports.getPermissionFuncs = catchAsync(async (req, res, next) => {
  const { roleIds } = req.user
  
  // 添加预检查
  if (!roleIds?.length) {
    return res.success([]);
  }

  // 优化查询，只获取需要的字段
  const roles = await Role.find(
    { _id: { $in: roleIds } },
    { funcs: 1 }
  ).select('funcs');

  // 使用 flatMap 简化数组操作
  const allFuncs = roles
    .flatMap(role => role.funcs)
    .filter(Boolean); // 过滤掉可能的 null/undefined 值

  if (!allFuncs.length) {
    return res.success([]);
  }

  // 优化查询，只获取需要的字段
  const functionCodes = await Func.find(
    { _id: { $in: allFuncs } },
    { functionCode: 1 }
  ).lean(); // 使用 lean() 获取普通 JavaScript 对象，提高性能
  const data = functionCodes.map(item => item.functionCode)
  return res.success(data);
})