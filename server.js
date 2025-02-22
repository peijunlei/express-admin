// 1. 首先加载环境变量
const envFile = process.env.NODE_ENV === 'production'
  ? '.env'
  : '.env.development';

require('dotenv').config({
  path: envFile
});

// 2. 验证环境变量
const requiredEnvVars = ['PORT', 'MONGODB_URL', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error('缺少必要的环境变量:', missingEnvVars.join(', '));
  process.exit(1);
}

// 3. 引入依赖
const app = require('./app')
const connectDB = require('./config/db')

// 4. 设置端口
const port = process.env.PORT

// 5. 创建启动函数
async function startServer() {
  try {
    // 先连接数据库
    await connectDB();

    // 数据库连接成功后再启动服务器
    app.listen(port, () => {
      console.log(`服务器启动成功，监听端口:${port}`);
    });
  } catch (err) {
    console.error('服务器启动失败:', err);
    process.exit(1);
  }
}

// 6. 设置全局错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝:', err);
  process.exit(1);
});

// 7. 启动服务器
startServer();

