/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-24 09:44:22
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 10:08:29
 */
const exec = require('child_process').exec
var iconv = require('iconv-lite')
var encoding = 'cp936'
var binaryEncoding = 'binary'

const run = () => {
  const cmd = 'cd D:/Softs/Redis-x64-5.0.14.1 && redis-server.exe redis.windows.conf'
  exec(cmd, { encoding: binaryEncoding }, (err, data, o) => {
    if (err) {
      console.log('Err: ', err)
      return
    }
    console.log('Redis 服务已启动！')
    const buffer = Buffer.from(data, binaryEncoding)
    const r = iconv.decode(buffer, encoding)
    console.log(r)
  })
}
run()