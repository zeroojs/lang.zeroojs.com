/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:10:35
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:04:29
 */

/**
 * ready 已有原文但译文为空
 * editing 已有原文但译文没有完成
 * finish 原文译文都完成
 */
const mongoose = require('mongoose')

const TranSchema = mongoose.Schema({
  name: String, // 语言包名称
  filename: String, // 文件名称
  savePath: String, // 存储路径
  website: [], // 使用站点
  size: Number, // 文件大小
  isMerge: { // 是否是合并文件
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'ready' // ready | editing | finish
  },
  from: { // 原文语种
    type: mongoose.Schema.ObjectId,
    ref: 'lang'
  },
  to: { // 译文语种
    type: mongoose.Schema.ObjectId,
    ref: 'lang'
  },
  lang: { // 当前语种
    type: mongoose.Schema.ObjectId,
    ref: 'lang'
  },
  user: { // 用户
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  mark: String, // 备注
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


module.exports = mongoose.model('trans', TranSchema)