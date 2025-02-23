
const Api = require('../models/Api')
const factory = require('./handlerFactory')


exports.getAllApis = factory.getAll(Api)
exports.getApi = factory.getOne(Api)
exports.updateApi = factory.updateOne(Api)
exports.deleteApi = factory.deleteOne(Api)
exports.addApi = factory.createOne(Api)
