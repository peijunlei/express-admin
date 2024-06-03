const mongoose = require('mongoose');

// 验证码模型
const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});


module.exports =  mongoose.model('VerificationCode', verificationCodeSchema);
