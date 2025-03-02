const mongoose = require('mongoose');

const connectDB = async () => {
  // 设置全局 Schema 配置
  mongoose.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      return ret;
    }
  });
  // 设置虚拟字段
  mongoose.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id; 
      delete ret.password;
      return ret;
    }
  });
  
  const dbOptions = {
    dbName: process.env.DB_NAME, // 数据库名称
    serverSelectionTimeoutMS: 5000, // 服务器选择超时时间（毫秒）
    autoIndex: true, // 是否自动创建索引
    autoCreate: true // 是否自动创建集合
  };

  try {
    await mongoose.connect(process.env.MONGODB_URL, dbOptions);
    console.log('MongoDB 连接成功');

    // 监听数据库连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB 连接断开');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB 重新连接成功');
    });

    // 优雅关闭数据库连接
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB 连接已关闭');
        process.exit(0);
      } catch (err) {
        console.error('关闭 MongoDB 连接时出错:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('MongoDB 连接失败:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 