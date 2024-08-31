
const Const = require('../constant');
/**
 * 处理成功响应
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
  res.success = (data=null, message = null, statusCode = 200) => {
    res.status(statusCode).json({
      code: Const.SUCCESS_CODE,
      data,
      message,
    });
  };
  next();
}
