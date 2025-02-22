const Const = require('../constant');
const logger = require('../utils/logger');

/**
 * 处理成功响应的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express 下一个中间件函数
 */
module.exports = (req, res, next) => {
  res.success = (data = null, message = null, statusCode = 200) => {
    const response = {
      code: Const.SUCCESS_CODE,
      data,
      message,
    };
    // 记录响应日志
    logger.info(`${req.method} ${req.originalUrl}`, {
      statusCode,
      response,
    });

    res.status(statusCode).json(response);
  };

  next();
};
