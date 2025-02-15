
/**
 * @description: APIFeatures class
 * @param {query} mongoose query  eg: User.find()
 * @param {queryString} req.query
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    // 移除没有值的字段
    const queryObj = Object.assign({}, queryString)
    for (const key in queryObj) {
      if (!queryObj[key]) delete queryObj[key]
    }
    this.queryString = queryObj
  }
  filter() {
    const queryObj = { ...this.queryString }
    // const excludeFields = ['page','sort','limit','fields']
    // excludeFields.forEach(el => delete queryObj[el])
    // let queryStr = JSON.stringify(queryObj)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`)


    // 构建模糊查询 { $regex: xxx, $options: 'i' }
    for (const key in queryObj) {
      if (!['pageNum', 'pageSize'].includes(key)) {
        queryObj[key] = { $regex: queryObj[key], $options: 'i' }
      }
    }
    // console.log('queryObj===>', queryObj)
    this.query = this.query.find(queryObj)
    return this
  }
  sort() {
    // if (this.queryString.sort) {
    //   const sortBy = this.queryString.sort.split(',').join(' ')
    //   this.query = this.query.sort(sortBy)
    // } else {
    //   this.query = this.query.sort('-createTime')
    // }
    this.query = this.query.sort({ createTime: -1 })

    return this

  }
  limitFields() {
    // if (this.queryString.fields) {
    //   const fields = this.queryString.fields.split(',').join(' ')
    //   this.query = this.query.select(fields)
    // } else {
    //   this.query = this.query.select('-__v')
    // }
    // this.query = this.query.select('-__v')
    return this
  }
  paginate() {
    const pageNum = parseInt(this.queryString.pageNum) || 1
    const pageSize = parseInt(this.queryString.pageSize) || 10
    const skip = (pageNum - 1) * pageSize
    this.query = this.query.skip(skip).limit(pageSize)
    return this
  }
}


module.exports = APIFeatures