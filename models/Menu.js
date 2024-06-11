const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    label: { type: String, required: true }, // 菜单项名称
    route: { type: String, required: true }, // 
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null }, // 父节点ID，默认值为null表示根节点
    icon: { type: String, default: null }, // 菜单项图标
    type: { type: Number, required: true }, // 菜单项类型，例如 0 表示目录，1 表示菜单项 2 表示按钮
    order: { type: Number, required: true }, // 菜单项排序
    hide: { type: Boolean, default: false }, // 是否隐藏
    disabled: { type: Boolean, default: false }, // 是否禁用
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