

const mongoose = require('mongoose');

/**
 * apiName: 接口名称
 * apiUrl: 接口地址
 * method: 请求方式
 */
const apiSchema = new mongoose.Schema({
  apiName: { type: String, required: true }, // 接口名称
  apiUrl: { type: String, required: true }, // 接口地址
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
  }, // 请求方式
});
// 不暴露 __v _id 字段
apiSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id; // 添加自定义的 id 字段
    delete ret._id; // 删除 _id 字段
  }
});
const Api = mongoose.model('Api', apiSchema);
module.exports = Api;