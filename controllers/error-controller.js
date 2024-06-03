
const chalk = require('chalk')
const Const = require('../constant')
const AppError = require('../utils/app-error')
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const errorMap = {
  CastError: 'CastError',
  ValidationError: 'ValidationError',
  JsonWebTokenError: 'JsonWebTokenError',
  TokenExpiredError: 'TokenExpiredError',
}
module.exports = (err, req, res, next) => {
  // 打印错误 颜色区分
  console.log(chalk.red('errpr'), err)
  console.log(chalk.red('error'), JSON.stringify(err))
  let statusCode = err.statusCode || 400
  let message = err.message || '服务器错误'
  let code = err.errorCode || Const.FAIL_CODE
  switch (err.name) {
    case errorMap.CastError:
      statusCode = 400
      message = `无效的字段: ${err.path}: ${err.value}`
      break;
    case errorMap.ValidationError:
      statusCode = 400
      if(err.message){
        message = err.message
        break;
      }
      message = `参数不正确:${Object.values(err.errors).map(item => item.path).join(';')}`
      break;
    case errorMap.JsonWebTokenError:
      statusCode = 401
      message = '无效的token，请重新登录'
      break;
    case errorMap.TokenExpiredError:
      statusCode = 401
      message = '登录已过期，请重新登录'
      break;
    default:
      break;
  }
  if (err.code === 11000) {
    // 获取重复的字段和值
    console.log('1212',err)
    const duplicatedField = Object.keys(err.keyPattern)[0];
    const duplicatedValue = err.keyValue[duplicatedField];
    message = `${duplicatedField}:${duplicatedValue}已存在`
  }
  res.status(statusCode).json({ code, data: null, message })
  next()
}