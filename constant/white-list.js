/**
 * 请求白名单
 */
module.exports = [
  '/menus/permission',
  '/funcs/permission',
].map(url => `${process.env.API_PREFIX}${url}`)