const express = require('express')
const setupMiddleware = require('./middleware')
const Const = require('./constant')
const AppError = require('./utils/app-error')
const globalErrorHandler = require('./controllers/error-controller')
const setupRoutes = require('./routes')

const app = express()

// 配置中间件
setupMiddleware(app)
// 配置路由
setupRoutes(app)

// 处理未定义路由
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, Const.ERROR_CODE, 404))
})

// 处理错误
app.use(globalErrorHandler)

module.exports = app
