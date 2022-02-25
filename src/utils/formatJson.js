/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 13:35:19
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:16:02
 */

// 将翻译原文和译文格式化为 json
const defOptions = { minify: false }
export function formatJson(oc = '', tc = '', options = defOptions) {
  if (!verifyTargetContent(oc, tc)) {
    return '译文格式错误'
  }
  const obj = {}
  const okeys = (oc.trim()).split('\n')
  const tkeys = (tc.trim()).split('\n')
  okeys.forEach((c, i) => {
    if (!c) throw Error('The key is\'nt allowed empyt!')
    // const val = tkeys[i] === 'null' ? '' : (tkeys[i] || '')
    const val = (tkeys[i] || '')
    obj[c] = val
  })
  if (options.minify) {
    return JSON.stringify(obj)
  }
  return JSON.stringify(obj, null, 2)
}

// 校验译文格式是否正确
export function verifyTargetContent(oc = '', tc = '') {
  oc = oc.trim()
  tc = tc.trim()
  const okeys = oc.split('\n')
  const tkeys = tc.split('\n')
  // if (okeys.length !== tkeys.length) return false
  // if (okeys.length < tkeys.length) return false
  return okeys.length >= tkeys.length
  // return tc.indexOf('\n\n') === -1
}

export function jsonToContent(json = {}) {
  const keys = Object.keys(json)
  // const vals = Object.values(json).map(item => item === '' ? 'null' : item)
  const vals = Object.values(json)
  return {
    origin: keys.join('\n').trim(),
    target: vals.join('\n').trim()
  }
}