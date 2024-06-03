


const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  tourName: {
    type: String,
    unique: true,
    required: [true, 'tourName字段缺失'],
  },
  imageCover: {
    type: String,
    default: null
  },
  images: [String],
  startLocation: {
    type: {
      type: String,
      default: 'point',
      enum: ['point']
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: 'point',
        enum: ['point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
})
tourSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
});
// 虚拟字段 
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
})
tourSchema.pre(/^find/, async function (next) {
  // this.populate({
  //   path: 'guides',
  //   select: 'id phone email age'
  // })
  next()
})
// save 之前执行
tourSchema.pre('save', async function (next) {
  next()
})
module.exports = mongoose.model('Tour', tourSchema)

