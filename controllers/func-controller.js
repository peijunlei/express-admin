
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
  const roles = await Role.find({ _id: { $in: roleIds } }).select('funcs');
  // 合并所有角色的功能
  const allFuncs = roles.reduce((acc, role) => {
    return acc.concat(role.funcs);
  }, []);
  // 无需去重，因为功能是唯一的
  const functionCodes = await Func.find({ _id: { $in: allFuncs } }).select('functionCode')
  res.success(functionCodes.map(item => item.functionCode));
})