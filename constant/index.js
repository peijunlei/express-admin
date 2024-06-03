

module.exports = {

  //  限制请求次数
  LIMIT_ERROR: '请求次数过多，请稍后再试!',
  //  success
  SUCCESS_CODE: 'K-000000',
  SUCCESS_MSG: '操作成功',
  // fail
  FAIL_CODE: 'K-000001',
  FAIL_MSG: '操作失败',
  // error
  ERROR_CODE: 'K-999999',
  ERROR_MSG: '服务器内部错误',
  // verify password error
  VERIFY_PASSWORD_ERROR: '账号或密码错误',
  // Unauthorized
  UNAUTHORIZED_MSG: '授权失败',
  UNAUTHORIZED_CODE: 'K-000015',
  UNAUTHORIZED_USER_NO_FOUND: '用户不存在',
  UNAUTHORIZED_PASSWORD_CHANGED:'当前用户密码已变更，请重新登录',
  // Forbidden
  FORBIDDEN_MSG: '暂无权限',
  FORBIDDEN_CODE: 'K-000016',
  TOKEN_INVALID:'token无效或已过期',
  CAN_NOT_UPDATE_PASSWORD: '不能更新密码',
  // resource not found
  RESOURCE_NOT_FOUND: '资源不存在',
  SEND_EMAIL_ERROR: '发送邮件失败',
  // 手机号正则
  PHONE_REG: /^1[3-9]\d{9}$/,
  // 验证码
  VERIFY_CODE_ERROR: '验证码错误',
  VERIFY_CODE_EXPIRED: '验证码已过期',
}