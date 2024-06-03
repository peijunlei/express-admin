


const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'reviewName字段缺失'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'rating字段缺失'],
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user字段缺失'],
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'tour字段缺失'],
  },
})
reviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
});
reviewSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'user',
    select: 'email'
  })
  next()
})
// save 之前执行
reviewSchema.pre('save', async function (next) {
  next()
})

module.exports = mongoose.model('Review', reviewSchema)

