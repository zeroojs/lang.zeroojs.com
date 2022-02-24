/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-08 15:33:14
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-22 00:21:28
 */
const path = require('path')
const { readFileSync } = require('fs-extra')
const SparkMD5 = require('spark-md5')

// 根据文件内容和后缀生成唯一hash
function genHASHByFile(file) {
  file = readFileSync(path.resolve(__dirname, './service.js'), {
    encoding: ''
  })
  // const fileReader = new FileReader()
  // return new Promise(resolve => {
  //   fileReader.readAsArrayBuffer(file)
  //   fileReader.onload = function() {
  //     const buffer = this.result
  //     const HASH = new SparkMD5().append(buffer).end()
  //     resolve(HASH)
  //   }
  // })
}
// genHASHByFile()

const qs = require('querystring')
console.log(qs.parse('access_token=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&scope=user&token_type=bearer'))