/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:10:35
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:25:59
 */
const mongoose = require('mongoose')
const LangSchema = mongoose.Schema({
  name: String,
  value: String, // api 引用名称
  mark: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.createdAt = +new Date(ret.createdAt)
      ret.updatedAt = +new Date(ret.updatedAt)
      return ret
    }
  }
})


module.exports = mongoose.model('lang', LangSchema)