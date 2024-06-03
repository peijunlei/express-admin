
const Const = require('../constant')
const Menu = require('../models/Menu')
const AppError = require('../utils/app-error')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


exports.getAllMenus = factory.getAll(Menu)
exports.createMenu = factory.createOne(Menu)