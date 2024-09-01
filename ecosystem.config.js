module.exports = {
  apps: [
    {
      name: 'express-admin',
      script: './lib/express-admin',
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        //  # jwt
        JWT_SECRET: 'ABCDabcd1234567890',
        // # jwt 过期时间
        JWT_EXPIRES_IN: '1d',
        // # cookie
        JWT_COOKIE_EXPIRES_IN: 1,
        // # mogodb_url
        MONGODB_URL: 'mongodb://root:peijunlei@121.41.59.32:27017',
        // #  数据库名
        DB_NAME: 'blog',
        QQ: 'junleipei@qq.com',
        // # QQ_PASS
        QQ_PASS: 'slqcyiywlhzkfeec',
      }
    }
  ]
};
