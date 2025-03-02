const { validateApiRequest } = require("../utils/jwt");
const Role = require("../models/Role");
const Func = require("../models/Func");
const Api = require("../models/Api");

// 将验证逻辑抽取为独立函数  TODO:优化- 使用缓存
const validateApiAccess = async (user, request) => {
  const { roleIds } = user;
  const roles = await Role.find({ _id: { $in: roleIds } }).select('funcs');
  // console.log('roles', roles)
  // 合并所有角色的功能
  const allFuncIds = roles.reduce((acc, role) => {
    return acc.concat(role.funcs);
  }, []);
  // console.log('allFuncIds', allFuncIds)
  const allFuncs = await Func.find({
    _id: {
      $in: allFuncIds
    }
  }).select('apiIds')
  // console.log('allFuncs', allFuncs)
  const allApiIds = allFuncs.map(func => func.apiIds).flat()
  // console.log('allApiIds', allApiIds)
  const allApis = await Api.find({
    _id: {
      $in: allApiIds
    }
  })
  // console.log('allApis', allApis)
  return validateApiRequest(request, allApis);
};


// 导出验证函数 默认导出？
module.exports = validateApiAccess
