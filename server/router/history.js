/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-11 00:15:46
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-11 00:18:20
 */
const history = require('connect-history-api-fallback')

module.exports = history({
  disableDotRule: true,
  verbose: true
})
