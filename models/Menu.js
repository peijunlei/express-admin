const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  label: { type: String, required: true }, // 菜单项名称
  route: {
    type: String,
    // type = 0 1 2 时必填
    required: function () {
      return [0, 1, 2].includes(this.type)
    }
  }, // 菜单项路由
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null }, // 父节点ID，默认值为null表示根节点
  icon: { type: String, default: null }, // 菜单项图标
  type: { type: Number, required: true }, // 菜单项类型
  order: { type: Number, required: true }, // 菜单项排序
  hide: { type: Boolean, default: false }, // 是否隐藏
  disabled: { type: Boolean, default: false }, // 是否禁用
  delflag: { type: Boolean, default: false }, // 是否删除
  newFeature: { type: Boolean, default: false }, // 是否是新功能
  functionName: { type: String, default: null }, // 功能名称 type 为 3 时有效
  authUrl: { type: String, default: null }, // 权限URL
  authMethod: { type: String, default: null }, // 权限方法
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
menuSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id; // 添加自定义的 id 字段
    delete ret._id; // 删除 _id 字段
  }
});
const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;