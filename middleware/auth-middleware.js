const AppError = require("../utils/app-error");
const Const = require("../constant");
const catchAsync = require("../utils/catchAsync");
const { verifyJwtToken } = require("../utils/jwt");
const User = require("../models/User");
// auth
exports.authGuard = catchAsync(async (req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
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

