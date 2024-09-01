

const express = require('express')
const cors = require('cors') // 跨域
const morgan = require('morgan') // 日志
const limit = require('express-rate-limit') // 限制请求次数
const helmet = require('helmet') // 安全
const app = express()

const Const = require('./constant');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');
const successResMiddleware = require('./middleware/success-response');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menu');
const roleRouter = require('./routes/role');
// 安全中间件
app.use(helmet());
// 限制请求次数
const limiter = limit({
  max: 10000, // 最大请求次数
  windowMs: 60 * 60 * 1000,// 1小时
  message: Const.LIMIT_ERROR// 错误信息
})

app.use(limiter)
// 第三方中间件
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

// 处理成功响应
app.use(successResMiddleware);

// 用户路由
app.use('/api/v1/users', userRouter)
// 菜单路由
app.use('/api/v1/menus', menuRouter)
// 角色路由
app.use('/api/v1/roles', roleRouter)
app.use('/api/v1/test', (req, res) => {
  res.json({
    message: 'test success'
  })
})
// 处理未定义路由
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, Const.ERROR_CODE, 404))
})
// 处理错误
app.use(globalErrorHandler)
module.exports = app