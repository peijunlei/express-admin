const express = require('express');
const router = express.Router();

/**
 * 健康检查路由
 * @route GET /health
 */
router.get('/', (req, res) => {
  res.success('健康检查成功');
});

module.exports = router; 