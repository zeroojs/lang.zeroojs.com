/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 09:21:18
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 18:01:05
 */
const { readFileSync, writeFileSync, unlink } = require('fs-extra')
const TranSchema = require('../schema/trans')
const path = require('path')
const SparkMD5 = require('spark-md5')
const request = require('../request')
const { getTranStatus, mergeJson } = require('../utils')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 6)

// ！站点语言包合并

module.exports = {
  async queryTran(id) {
    const data = await TranSchema.findById(id)
    if (!data) return { code: -1, data, message: '语言包不存在' }
    const file = readFileSync(data.savePath)
    return { code: 0, data: { ...data._doc, content: JSON.parse(file) }, message: 'success' }
  },
  // 站点请求语言包
  async queryTranBySite({ website, lang }) {
    const filter = {
      lang,
      website: { $in: website }
    }
    if (!website) {
      delete filter.website
    }
    const data = await TranSchema.findOne(filter)
    if (!data) return { code: -1, data, message: '语言包不存在' }
    const file = readFileSync(data.savePath)
    return { code: 0, data: JSON.parse(file), message: 'success' }
  },
  async queryTrans({ uuid }) {
    const data = await TranSchema
      // user: uuid 
      .find({ user: uuid }, { user: 0, from: 0, to: 0, savePath: 0 })
      .populate('lang')
      .sort({ createdAt: -1 })
    return { code: 0, data, message: 'success' }
  },
  async createTran({ file, mark, website, lang, from, to, uuid }) {
    // const tran = await TranSchema.findOne({ name })
    // if (tran) {
    //   return { code: -1, data: null, message: '语言包已存在' }
    // }
    const status = getTranStatus(file)
    const fileMd5 = genHASHByFile(file)
    const filename = `${nanoid()}_${fileMd5}.json`
    const filePath = path.resolve(__dirname, '../resouces/' + filename)
    let size = file.size / 1024 // B -> KB
    size = size < 1 ? 1 : Math.round(size)
    if (website && typeof website === 'string') {
      website = website.split(',')
    }
    const newTran = {
      user: uuid,
      lang,
      from,
      to,
      status,
      filename,
      savePath: filePath,
      website: website || [],
      size,
      mark: mark || ''
    }
    writeFileSync(filePath, file.buffer, { encoding: 'utf-8' })
    const data = await TranSchema.create(newTran)
    return { code: 0, data, message: 'success' }
  },
  async updateTran({ id, file, mark, website, lang, from, to, uuid }) {
    const tran = await TranSchema.findOne({ _id: id })
    if (!tran) {
      return { code: -1, data: null, message: '语言包不存在' }
    }
    const status = getTranStatus(file)
    let size = file.size / 1024 // B -> KB
    size = size < 1 ? 1 : Math.round(size)
    if (website && typeof website === 'string') {
      website = website.split(',')
    }
    const newTran = {
      user: uuid,
      from,
      to,
      lang,
      status,
      website: website || [],
      size,
      mark
    }
    if (!website || !website.length) {
      delete newTran.website
    }
    writeFileSync(tran.savePath, file.buffer, { encoding: 'utf-8' })
    const data = await TranSchema.updateOne({ _id: id }, { $set: newTran })
    return { code: 0, data, message: 'success' }
  },
  async delTran({ id }) {
    const tran = await TranSchema.findOne({ _id: id })
    if (!tran) {
      return { code: -1, data: null, message: '语言包不存在' }
    }
    try {
      await unlink(tran.savePath)
      await TranSchema.deleteOne({ _id: id })
      return { code: 0, message: 'success' }
    } catch(err) {
      console.log(err)
      if (err.syscall === 'unlink') {
        await TranSchema.deleteOne({ _id: id })
        return { code: 0, message: 'success' }
      }
      return { code: -1, message: `错误信息：${err}` }
    }
  },
  async transOnline({ from, to, q }) {
    const result = await transOnline(from, to, q)
    if (result.error_code) return { code: result.error_code, data: null, message: result.error_msg }
    return {
      code: 0,
      data: {
        from: result.from,
        to: result.to,
        content: result.trans_result
      },
      message: 'success'
    } 
  },
  // 合并语言包
  async mergeTrans({ ids = [], mainId = '', mark = '', uuid }) {
    if (!ids.length) return { code: -1, data: null, message: 'fail' }
    const trans = await Promise.all(ids.map(id => TranSchema.findById(id)))
    const mainTran = trans.find(t => t._id === mainId || trans[0]._id)
    let website = trans.reduce((p, c) => { // 站点合并
      return [...p, ...(c.website || [])]
    }, [])
    website = [...(new Set(website))]
    const data = mergeJson(trans.map(t => t.savePath), mainTran ? mainTran.savePath : '')
    const buffer = Buffer.from(data)
    const status = getTranStatus({ buffer })
    const fileMd5 = genHASHByFile({ buffer })
    const filename = `${nanoid()}_${fileMd5}.json`
    const filePath = path.resolve(__dirname, '../resouces/' + filename)
    let size = buffer.length / 1024 // B -> KB
    size = size < 1 ? 1 : Math.round(size)
    const newTran = {
      user: uuid,
      lang: mainTran.lang,
      from: mainTran.from,
      to: mainTran.to,
      status,
      filename,
      name: '',
      savePath: filePath,
      website: website || [],
      size,
      mark: mark || '',
      isMerge: true
    }
    const newTranData = await TranSchema.create(newTran)
    writeFileSync(filePath, data, { encoding: 'utf-8' })
    return { code: 0, data: newTranData, message: 'success' }
  }
}

// 根据文件内容和后缀生成唯一hash
function genHASHByFile(file) {
  return new SparkMD5().append(file.buffer).end()
}

// 百度在线翻译
function transOnline(from, to, q) {
  return request.get('/translate', {
    params: { from, to, q }
  })
}