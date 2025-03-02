const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const WHITE_LIST = require('../constant/white-list');
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;
/**
 *  创建token
 * @param {*} user 
 * @returns 
 */
exports.createJwtToken = function (user) {
  return jwt.sign({ id: user._id }, secret, { expiresIn });
}
/**
 *  验证token
 * @param {*} token 
 * @returns 
 */
exports.verifyJwtToken = function (token) {
  return jwt.verify(token, secret);
}

/**
 *  创建重置密码token
 * @returns {resetPasswordToken,resetPasswordExpire}
 */
exports.createResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return { resetPasswordToken, resetPasswordExpire }
}
const removeQueryParams = (url) => {
  return url.split('?')[0];
};
// 添加路径匹配函数
const isUrlMatch = (apiUrl, requestUrl) => {
  // 将 API 路径转换为正则表达式模式
  // 例如: /api/v1/apis/:id 转换为 /api/v1/apis/[^/]+
  const pattern = apiUrl.replace(/\/:[^/]+/g, '/[^/]+');
  const regExp = new RegExp(`^${pattern}$`);
  // console.log('isUrlMatch', apiUrl, requestUrl)
  // console.log(regExp.test(requestUrl))
  return regExp.test(requestUrl);
};
// 定义函数来处理验证
exports.validateApiRequest = (request, apiArray) => {
  // 使用 originalUrl 或 path 替代 url
  const url = removeQueryParams(request.originalUrl || request.path);
  const method = request.method;
  if (WHITE_LIST.includes(url)) {
    return true
  }
  // 遍历限定的 api 数组
  for (const api of apiArray) {
    const apiUrl = `${process.env.API_PREFIX}${api.apiUrl}`;
    const apiMethod = api.method;
    // console.log('api Url', apiUrl, 'api Method', apiMethod)
    // console.log('req Url', url, 'req Method', method)
    // 判断 URL 和 Method 是否匹配
    if (isUrlMatch(apiUrl, url) && method.toUpperCase() === apiMethod.toUpperCase()) {
      return true
    }
  }
  // 如果没有找到匹配项
  return false
}