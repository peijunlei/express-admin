const userRouter = require('./user');//用户
const authRouter = require('./auth');//认证
const menuRouter = require('./menu');//菜单
const roleRouter = require('./role');//角色
const funcRouter = require('./func');//功能
const apiRouter = require('./api');//接口
const menuAuthRouter = require('./menu-auth');//菜单权限
const healthRouter = require('./health');//健康检查
// API 版本前缀
const API_PREFIX = process.env.API_PREFIX;
console.log('API_PREFIX', API_PREFIX)
const routes = [
  { path: '/auth', router: authRouter },
  { path: '/users', router: userRouter },
  { path: '/menus', router: menuRouter },
  { path: '/roles', router: roleRouter },
  { path: '/funcs', router: funcRouter },
  { path: '/apis', router: apiRouter },
  { path: '/menuAuth', router: menuAuthRouter },
  { path: '/health', router: healthRouter }
];

/**
 * 配置应用程序路由
 * @param {Express.Application} app - Express 应用实例
 */
const setupRoutes = (app) => {
  // 注册路由
  routes.forEach(({ path, router }) => {
    app.use(`${API_PREFIX}${path}`, router);
  });
};

module.exports = setupRoutes; 