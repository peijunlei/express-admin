/**
 * @description: APIFeatures class
 * @param {query} mongoose query  eg: User.find()
 * @param {queryString} req.query
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    try {
      // 移除没有值的字段
      const queryObj = Object.assign({}, queryString)
      for (const key in queryObj) {
        if (!queryObj[key] || queryObj[key].trim() === '') delete queryObj[key]
      }
      this.queryString = queryObj
    } catch (error) {
      throw new Error('查询参数格式错误')
    }
  }
  filter() {
    try {
      const queryObj = { ...this.queryString }
      // 排除分页和排序相关的参数
      const excludeFields = ['pageNum', 'pageSize', 'sort', 'createTime','updateTime']
      excludeFields.forEach(field => delete queryObj[field])

      // 对剩余字段进行模糊查询
      for (const key in queryObj) {
        queryObj[key] = { $regex: queryObj[key], $options: 'i' }
      }
      this.query = this.query.find(queryObj)
      return this
    } catch (error) {
      throw new Error('过滤参数处理失败')
    }
  }
  sort() {
    this.query = this.query.sort({ createTime: -1 })
    return this

  }
  limitFields() {
    // 预留
    return this
  }
  paginate() {
    try {
      const pageNum = Math.max(parseInt(this.queryString.pageNum) || 1, 1)
      const pageSize = Math.min(Math.max(parseInt(this.queryString.pageSize) || 10, 1), 100)
      const skip = (pageNum - 1) * pageSize
      this.query = this.query.skip(skip).limit(pageSize)
      return this
    } catch (error) {
      throw new Error('分页参数处理失败')
    }
  }
}


module.exports = APIFeatures