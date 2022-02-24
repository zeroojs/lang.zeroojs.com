/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 14:47:58
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 23:47:27
 */
const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const connect = require('./db')
const router = require('./router')
const authMiddleware = require('./utils/auth')
const { redisBootstrap } = require('./redis')


const app = express()

app.use(cors())
app.use(bodyParser())
app.use(authMiddleware)
app.use(router)
 // 静态资源（语言包）
app.use('/language', express.static(path.resolve(__dirname, './resouces/')))

// router.get('/lang', async (req, res) => {
//   const { website, lang } = req.query
//   const result = await queryTranBySite({ website, lang })
//   res.json(result)
// })


const port = 9527
app.listen(port, () => {
  connect()
    .then((r) => {
      console.log(`已连接到：${r.connections[0]._connectionString}`)
    })
    .then(() => redisBootstrap())
    .then(() => {
      console.log(`http://localhost:${port}`)
    })
})