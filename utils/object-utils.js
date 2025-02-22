/**
 * 排除对象中的指定字段
 * @param {Object} obj - 要处理的对象
 * @param  {...string} excludeKeys - 要排除的字段
 * @returns {Object} 新的对象
 */
function excludeObj(obj, ...excludeKeys) {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (!excludeKeys.includes(key)) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}

/**
 * 排除 request body 中的指定字段的中间件
 * @example excludeBody('role', 'password', 'passwordConfirm') 更新用户时，排除 role，password，passwordConfirm 三个字段
 * @param  {...string} keys 要排除的字段
 * @returns {Function} Express 中间件
 */
exports.excludeBody = (...keys) => (req, res, next) => {
  req.body = excludeObj(req.body, ...keys)
  next()
}

exports.excludeObj = excludeObj