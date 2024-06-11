


const mongoose = require('mongoose');

/**
 * @type {import('validator').default}
 */
const validator = require('validator');
const { hashPassword } = require('../utils/bcrypt');
const Const = require('../constant');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    sparse: true, // 使得 null 值不会被重复
    default: null,
    validate: {
      validator: function (val) {
        return val?Const.PHONE_REG.test(val):true
      },
      message: '手机号格式不正确'
    }
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    validate: [validator.isEmail, '邮箱格式不正确']
  },
  status: {
    type: Number,
    enum:{
      values: [0,1], // 0: 禁用 1: 启用
      message: '状态参数不正确'
    },  
    default: 1,
  },
  age: {
    type: Number,
    default: null,
  },
  roleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // 角色拥有的权限
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
  active: {
    type: Boolean,
    default: true,
    select: false // 默认不显示
  }
})
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  //  explain: 为了安全性，不返回 _id 和 password 字段
  transform: function (doc, ret) {
    delete ret._id
    delete ret.password
  }
});
// userSchema.alias('_id', 'id');
// 虚拟属性 不是真正的数据库字段 不能用于查询
// userSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// })
userSchema.pre(/^find/, async function (next) {
  // $ne 不等于
  this.find({ active: { $ne: false } })
  next()
})
// save 之前执行
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hashPassword(this.password)
  this.passwordConfirm = undefined
  next()
})
// save 之后执行
// userSchema.post('save', function (doc, next) {
//   doc.password = undefined
//   next()
// })
module.exports = mongoose.model('User', userSchema)

