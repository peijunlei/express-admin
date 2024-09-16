

const mongoose = require('mongoose');

/**
 * functionName: null;
  functionCode: string;
  order: number;
  createTime: Date;
  updateTime: Date;
  id: string;
  menuId: string;
 */
const funcSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true }, // 菜单ID
  apiIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Api', default: [] }], // 功能拥有的权限
  functionName: { type: String, required: true }, // 功能名称
  functionCode: {
    type: String,
    required: true,
    unique: true,
  }, // 功能编码
  order: { type: Number, required: true }, // 排序
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
});
// 不暴露 __v _id 字段
funcSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id; // 添加自定义的 id 字段
    delete ret._id; // 删除 _id 字段
  }
});
const Func = mongoose.model('Func', funcSchema);
module.exports = Func;