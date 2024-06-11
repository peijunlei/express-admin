// 区分环境
require('dotenv').config(
  {
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
  }
)
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT
const DB = process.env.MONGODB_URL
const dbName = process.env.DB_NAME
mongoose.set('strictQuery', true);
mongoose.connect(DB, {
  dbName,
}).then(async () => {
  console.log('MongoDB connection successful')
}).catch(err => {
  console.log('MongoDB connection failed', err)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})