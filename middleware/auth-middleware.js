const AppError = require("../utils/app-error");
const Const = require("../constant");
const catchAsync = require("../utils/catchAsync");
const { verifyJwtToken } = require("../utils/jwt");
const User = require("../models/User");
const validateApiAccess = require('./api-middleware');

// auth
exports.authGuard = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log('token:', token)
  if (!token) {
    return next(new AppError(Const.UNAUTHORIZED_MSG, Const.UNAUTHORIZED_CODE))
  }
  const decoded = verifyJwtToken(token);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError(Const.UNAUTHORIZED_USER_NO_FOUND, Const.UNAUTHORIZED_CODE));
  }
  // 4) Check if user changed password after the token was issued
  const isPasswordChanged = currentUser.passwordChangedTime && decoded.iat * 1000 < currentUser.passwordChangedTime.getTime();
  if (isPasswordChanged) {
    return next(new AppError(Const.UNAUTHORIZED_PASSWORD_CHANGED, Const.UNAUTHORIZED_CODE));
  }

  req.user = currentUser;
  console.log('req.user:', req.user.email)
  // 管理员直接放行
  if (currentUser.role === 'admin') {
    return next()
  }
  // 其他 调用 API 权限验证函数
  const hasApiAccess = await validateApiAccess(currentUser, req);
  if (!hasApiAccess) {
    return next(new AppError(Const.FORBIDDEN_MSG, Const.FORBIDDEN_CODE));
  }
  next();
})

// auth role admin
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // if (!roles.includes(req.user.role)) {
    //   return next(new AppError(Const.FORBIDDEN_MSG, Const.FORBIDDEN_CODE));
    // }
    next();
  }
}

// 
exports.isSelf = (req, res, next) => {
  const id = req.params.id
  // 自己更新 或者 管理员更新
  const _id = req.user._id.toString()
  const isAdmin = req.user.role === 'admin'

  // if (!isAdmin && _id !== id) {
  //   return next(new AppError(Const.FORBIDDEN_MSG, Const.FORBIDDEN_CODE));
  // }
  next()
}

// validatePermission
exports.validatePermission = async (req, res, next) => {
  // const user = req.user
  // console.log('user:', user)
  // const roleIds = user.roleIds.map(item => item.toString())
  // // 查询角色详情
  // const roles = await Role.find({ _id: { $in: roleIds } })
  // console.log('roles:', roles)
  // const allMenusIds = roles.reduce((pre, cur) => {
  //   return pre.concat(cur.menus.map(item => item.toString()))
  // }, [])
  // console.log('allMenusIds:', allMenusIds)
  // const allMenus = await Menu.find({ _id: { $in: allMenusIds } })
  // console.log('allMenus:', allMenus)
  next()
}

/**
 * 角色权限检查中间件
 * @param {...string} roles - 允许访问的角色列表
 * @returns {Function} Express 中间件
 */
exports.hasRole = (...roles) => {
  return async (req, res, next) => {
    try {
      // 确保用户已登录
      if (!req.user) {
        throw new AppError(Const.UNAUTHORIZED_MSG, Const.UNAUTHORIZED_CODE)
      }

      // 检查用户角色是否在允许的角色列表中
      if (!roles.includes(req.user.role)) {
        throw new AppError(Const.FORBIDDEN_MSG, Const.FORBIDDEN_CODE)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * 检查是否为管理员或自己的中间件
 * @returns {Function} Express 中间件
 */
exports.isAdminOrSelf = async (req, res, next) => {
  try {
    const userId = req.params.id
    const currentUser = req.user

    if (
      currentUser.role === 'admin' ||
      currentUser._id.toString() === userId
    ) {
      return next()
    }

    throw new AppError(Const.FORBIDDEN_MSG, Const.FORBIDDEN_CODE)
  } catch (error) {
    next(error)
  }
}
