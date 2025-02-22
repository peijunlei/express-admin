const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const limit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const timeout = require('connect-timeout');
const Const = require('../constant');
const successResMiddleware = require('./success-response');

/**
 * 配置应用程序中间件
 * @param {Express.Application} app - Express 应用实例
 */
const setupMiddleware = (app) => {
  // 安全中间件
  app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true
  }));

  // 启用 GZIP 压缩
  app.use(compression());

  // 请求超时设置（30秒）
  app.use(timeout('30s'));
  app.use((req, res, next) => {
    if (!req.timedout) next();
  });

  // CORS 配置
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));

  // 限制请求次数
  app.use(limit({
    max: process.env.RATE_LIMIT_MAX || 1000,
    windowMs: process.env.RATE_LIMIT_WINDOW || 60 * 60 * 1000,
    message: Const.LIMIT_ERROR,
    standardHeaders: true,
    legacyHeaders: false
  }));

  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // 基础中间件
  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 成功响应处理
  app.use(successResMiddleware);
};

module.exports = setupMiddleware; 