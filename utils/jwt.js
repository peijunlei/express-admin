
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
function pathTemplateToRegex(template) {
  // 处理查询参数部分
  let regexString = template
    .replace(/:[^\/?]+/g, '[^/]+')  // 替换动态部分
    .replace(/\?/g, '\\?')           // 转义问号
    .replace(/\//g, '\\/');          // 转义斜杠

  // 处理查询参数的匹配
  if (regexString.endsWith('\\?')) {
    regexString += '.*';  // 查询参数部分可选，允许任意字符
  }

  return new RegExp(`^${regexString}$`);
}
// 定义函数来处理验证
exports.validateApiRequest = (request, apiArray, isSupper) => {
  console.log('request', request,apiArray)

  const { url, method } = request;
  if (WHITE_LIST.includes(url) || isSupper) {
    return {
      match: true,
      message: `白名单: ${url}`
    };
  }
  // 遍历限定的 api 数组
  for (const api of apiArray) {
    const apiUrl = api.apiUrl;
    const apiMethod = api.method;
    const regex = pathTemplateToRegex(apiUrl);
    // 判断 URL 和 Method 是否匹配
    if (regex.test(url) && method.toUpperCase() === apiMethod.toUpperCase()) {
      return {
        match: true,
        message: `请求匹配: ${api.apiName}`
      };
    }
  }
  // 如果没有找到匹配项
  return {
    match: false,
    message: "未找到匹配的 API"
  };
}