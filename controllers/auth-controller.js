const crypto = require('crypto')
const Const = require('../constant')
const User = require('../models/User')
const VerificationCode = require('../models/VerificationCode')
const APIFeatures = require('../utils/api-features')
const AppError = require('../utils/app-error')
const { comparePassword } = require('../utils/bcrypt')
const catchAsync = require('../utils/catchAsync')
const { createJwtToken, createResetToken } = require('../utils/jwt')
const { sendEmail } = require('../utils/email')

// 发送验证码 邮箱
exports.sendCode = catchAsync(async (req, res) => {
  const code = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0')
  const email = req.body.email
  const msg = `【测试】 您本次的验证码为：${code}，有效时间5分钟`
  // 计算验证码的有效期（5分钟）
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  // 存储验证码到数据库
  await VerificationCode.findOneAndUpdate(
    { email }, // 查找条件
    { email, code, expiresAt }, // 更新内容
    { upsert: true, new: true } // 如果不存在则插入，存在则更新
  );
  await sendEmail({ email, subject: '验证码', message: msg })
  res.success(null, '验证码已发送')
})
// 邮箱&验证码注册
exports.registerByCode = catchAsync(async (req, res) => {
  const {
    email,
    code,
    password,
    passwordConfirm

  } = req.body
  console.log('email', email, code)
  // 1.判断验证码是否正确
  const record = await VerificationCode.findOne({ email })
  if (!record || record.code !== code) {
    throw new AppError(Const.VERIFY_CODE_ERROR)
  }
  // 2.判断验证码是否过期
  if (record.expiresAt < Date.now()) {
    throw new AppError(Const.VERIFY_CODE_EXPIRED)
  }

  // 2.创建用户
  const user = new User({
    email,
    password,
    passwordConfirm
  })
  const data = await User.create(user)
  // 验证成功后删除验证码
  await VerificationCode.deleteOne({ email });
  res.success(data)
})
// 注册 
exports.register = catchAsync(async (req, res) => {

  const user = new User({
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })
  console.log('user', user)
  const data = await User.create(user)
  res.success(data)
})

// 登录
exports.login = catchAsync(async (req, res) => {
  //1.获取用户信息
  const { password,email } = req.body
  console.log('email', email)
  //2.判断用户是否存在 //3.判断密码是否正确
  const user = await User.findOne({ email }).select('+password')
  console.log('user', user)
  if (!user || !await comparePassword(password, user.password)) {
    throw new AppError(Const.VERIFY_PASSWORD_ERROR, null, 200)
  }
  //4.返回token
  const token = createJwtToken(user)
  const data = { userInfo: user, token }
  const cookieExpirse = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000) // 有效期 x天
  res.cookie('token', token, {
    expirseIn: cookieExpirse,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
  res.success(data, null)
})

// 重置密码
exports.resetPassword = catchAsync(async (req, res) => {
  //1. 获取token
  const token = req.params.token
  //2. 根据token获取用户
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } })
  console.log('user', user)
  if (!user) {
    throw new AppError(Const.TOKEN_INVALID, null, 401)
  }
  //3. 更新密码
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save();
  res.success(user)
})
// 忘记密码
exports.forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body
  // 1.判断用户是否存在
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(Const.RESOURCE_NOT_FOUND)
  }
  // 2.生成重置密码token
  const { resetPasswordToken, resetPasswordExpire } = createResetToken()
  // 3.更新用户重置密码token和过期时间
  user.resetPasswordToken = resetPasswordToken
  user.resetPasswordExpire = resetPasswordExpire
  // 不验证user模型的验证器
  await user.save({ validateBeforeSave: false })

  // 4.发送重置密码邮件
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetPasswordToken}`
  const message = `点击链接重置密码: ${resetUrl}，有效时间10分钟`
  try {
    await sendEmail({
      email: user.email,
      subject: '重置密码邮件',
      message
    })
    res.success(null, '重置密码邮件已发送')
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    throw new AppError(Const.SEND_EMAIL_ERROR)
  }

})

// 修改密码
exports.updatePassword = catchAsync(async (req, res) => {
  // 1.获取用户
  const user = await User.findById(req.params.id).select('+password')
  // 2.判断用户输入的密码是否正确
  if (!await comparePassword(req.body.passwordCurrent, user.password)) {
    throw new AppError(Const.VERIFY_PASSWORD_ERROR)
  }
  // 3.更新密码
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // 4.返回token
  const token = createJwtToken(user)
  const data = { userInfo: user, token }
  res.success(data, null)
})

