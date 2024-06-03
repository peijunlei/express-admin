
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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