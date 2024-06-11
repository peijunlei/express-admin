const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 角色名称
    description: { type: String, default: null }, // 角色描述
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }], // 角色拥有的权限
    // users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 角色拥有的用户
    order: { type: Number, default: null }, // 角色排序
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
roleSchema.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id; // 添加自定义的 id 字段
        delete ret._id; // 删除 _id 字段
    }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;