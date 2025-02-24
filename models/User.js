const mongoose = require('mongoose');

/**
 * @type {import('validator').default}
 */
const validator = require('validator');
const { hashPassword } = require('../utils/bcrypt');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    sparse: true, // 使得 null 值不会被重复 稀疏索引
    default: null,
  },
  email: {
    type: String,
    required: [true, '请输入邮箱'],
    validate: {
      validator: async function(email) {
        // 获取当前文档的 _id（如果存在）
        const docId = this._id || this.getQuery?.()?._id;
        console.log('docId',this._id);
        
        // 直接使用 mongoose.model 来查询
        const User = mongoose.model('User');
        const existingUser = await User.findOne({ 
          email, 
          delflag: 0,  // 明确指定只查找未删除的
          _id: { $ne: docId }  // 排除自己
        });
        
        return !existingUser;
      },
      message: '该邮箱已被使用'
    }
  },
  delflag: {
    type: Number,
    enum:{
      values: [0,1], // 0 未删除 1 已删除
    },  
    default: 0
  },
  age: {
    type: Number,
    default: null,
  },
  roleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // 用户的角色
  /**
   * 角色 admin, user, guest
   */
  role: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user'
  },

  password: {
    type: String,
    required: [true, '密码不能为空'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, '确认密码不能为空'],
    validate: {
      validator: function (val) {
        return val === this.password
      },
      message: '两次密码不一致'
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
})
// save 之前执行
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hashPassword(this.password)
  this.passwordConfirm = undefined
  next()
})

userSchema.index(
  { email: 1, delflag: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { delflag: 0 }
  }
);

// 创建模型
const User = mongoose.model('User', userSchema);
module.exports = User;

