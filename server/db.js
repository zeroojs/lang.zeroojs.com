/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:23:49
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-22 10:12:57
 */
const mongoose = require('mongoose')
const { DB_ADDRESS } = require('./config')

module.exports = function connect() {
  // 连接本地数据库
  return mongoose.connect('mongodb://localhost:27017/tran-stage')
  // 连接远程数据库
  // return mongoose.connect(DB_ADDRESS)
}