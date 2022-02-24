/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:21:18
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:34:45
 */
const LangSchema = require('../schema/lang')

module.exports = {
  async queryLang(id) {
    const data = await LangSchema.findById(id)
    if (!data) return { code: -1, data, message: '语种不存在' }
    return { code: 0, data, message: 'success' }
  },
  async queryLangs({ uuid }) {
    const data = await LangSchema
      .find({ user: uuid }, { user: 0 })
      // .sort({ createdAt: -1 })
    return { code: 0, data, message: 'success' }
  },
  async createLang({ name, mark, value, uuid }) {
    const tran = await LangSchema.findOne({ name, user: uuid })
    if (tran) {
      return { code: -1, data: null, message: '语种已存在' }
    }
    const newLang = {
      user: uuid,
      name,
      value,
      mark
    }
    const data = await LangSchema.create(newLang)
    return { code: 0, data, message: 'success' }
  },
  async updateLang({ id, name, mark, value, uuid }) {
    const tran = await LangSchema.findOne({ _id: id })
    if (!tran) {
      return { code: -1, data: null, message: '语种不存在' }
    }
    const newLang = {
      user: uuid,
      name,
      value,
      mark
    }
    const data = await LangSchema.updateOne({ _id: id }, { $set: newLang })
    return { code: 0, data, message: 'success' }
  },
  async delLang({ id }) {
    const tran = await LangSchema.findOne({ _id: id })
    if (!tran) {
      return { code: -1, data: null, message: '语种不存在' }
    }
    await LangSchema.deleteOne({ _id: id })
    return { code: 0, message: 'success' }
  }
}