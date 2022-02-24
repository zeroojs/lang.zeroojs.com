/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-11 08:56:36
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 16:21:07
 */
const { mergeJson } = require('./merge')

function getTranStatus(file) {
  const buffer = Buffer.from(file.buffer)
  const str = buffer.toString('utf-8')
  const langJson = JSON.parse(str)
  const keys = Object.keys(langJson)
  let vals = Object.values(langJson)
  // if (!vals[vals.length - 1]) {
  //   vals = vals.filter(item => !!item)
  // }
  if (vals.length === 0) return 'ready'
  if (keys.length > vals.length) return 'editing'
  if (keys.length < vals.length) return 'exception'
  return 'finish'
}

exports.getTranStatus = getTranStatus
exports.mergeJson = mergeJson