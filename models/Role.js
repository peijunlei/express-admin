const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 角色名称
    description: { type: String, default: null }, // 角色描述
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu',default:[] }], // 角色拥有的权限
    funcs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Func',default:[] }], // 角色拥有的功能
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

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;