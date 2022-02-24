/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:10:35
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 13:39:33
 */
const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
  account: String, // 登录账户
  phoneNumber: String, // 手机号
  token: String,
  gitee: Object // gitee 信息
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


module.exports = mongoose.model('user', UserSchema)