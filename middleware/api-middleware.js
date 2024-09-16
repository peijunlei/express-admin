const AppError = require("../utils/app-error");
const Const = require("../constant");
const catchAsync = require("../utils/catchAsync");
const { validateApiRequest } = require("../utils/jwt");
const User = require("../models/User");
const Role = require("../models/Role");
const Menu = require("../models/Menu");
const Func = require("../models/Func");

// auth
exports.useApiAuth = catchAsync(async (req, res, next) => {
  console.log('api auth', req.url, req.method)

  // 如果没登录，直接返回
  if (!req.user) return next()
  const { roleIds } = req.user
  const roles = await Role.find({ _id: { $in: roleIds } }).select('funcs');
  // 合并所有角色的功能
  const allFuncIds = roles.reduce((acc, role) => {
    return acc.concat(role.funcs);
  }, []);
  // 无需去重，因为功能是唯一的
  const allApis = await Func.find({ _id: { $in: allFuncIds } }).select('apiIds').populate('apiIds')
  console.log('allApis2', allApis)
  const isMatch = validateApiRequest({ url: req.url, method: req.method }, allApis)
  console.log('isMatch', isMatch)
  next();
})
