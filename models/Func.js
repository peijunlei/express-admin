

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
const Func = mongoose.model('Func', funcSchema);
module.exports = Func;