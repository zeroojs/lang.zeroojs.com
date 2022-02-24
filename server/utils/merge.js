/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 15:12:33
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 18:20:44
 */
const { readJSONSync } = require('fs-extra')

function fileToJson(paths = []) {
  if (paths instanceof Array)
    return paths.map(p => readJSONSync(p, { encoding: 'utf-8' }))
  return readJSONSync(paths, { encoding: 'utf-8' })
}

/**
 * 
 * @param {string} paths json文件路径数组
 * @param {string} main 主文件，相同字段以此文件字段覆盖
 * @returns {string} json字符串
 */
function mergeJson(paths = [], mainPath = '') {
  const jsons = fileToJson(mainPath ? paths.filter(p => p !== mainPath) : paths)
  let data = jsons.reduce((p, c) => {
    return Object.assign(p, c)
  }, {})
  if (mainPath) {
    const mainJson = fileToJson(mainPath)
    data = Object.assign(data, mainJson)
  }
  return JSON.stringify(data)
}

exports.mergeJson = mergeJson
// module.exports = mergeJson

// const paths = [
//   'D:\\Work\\language-mini-system\\language-website\\server\\resouces\\app_certbase.16e9b0989c3802da7518be44a9e84ba8.json',
//   'D:\\Work\\language-mini-system\\language-website\\server\\resouces\\common.json'
// ]
// const data = mergeJson(paths, paths[0])
// console.log(Buffer.from(data))

// const file = readFileSync(paths[0])
// console.log(file.length)