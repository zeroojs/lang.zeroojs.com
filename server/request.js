/*
 * @Descripttion: Request Util
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 15:50:43
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 23:26:58
 */
const axios = require('axios')
const md5 = require('md5')
// 百度翻译 API 获取 appid 和 key
// https://fanyi-api.baidu.com/product/113
const { baidu } = require('./config')
const { APP_ID: appid, APP_KEY: key } = baidu

const request = axios.create({
  baseURL: 'https://fanyi-api.baidu.com/api/trans/vip',
  headers: {
    'Content-Type': 'application/json'
  }
})

function genDefParams(query = '') {
  const salt = (new Date).getTime()
  const sign = md5(appid + query + salt + key)
  return { salt, sign, appid }
}

request.interceptors.request.use(
  config => {
    config.params = {
      ...config.params,
      ...genDefParams(config.params.q)
    }
    return config
  }
)

request.interceptors.response.use(
  r => r.data
)

module.exports = request