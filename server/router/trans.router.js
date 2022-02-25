/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 09:48:30
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:47:37
 */
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const upload = multer({
  dest: false,
  // dest: path.resolve(__dirname, './resouces/'),
})
const {
  queryTran,
  queryTrans,
  createTran,
  updateTran,
  queryTranBySite,
  transOnline,
  delTran,
  mergeTrans
} = require('../service/trans.service')

module.exports = function useTransRouter(router) {
  // 创建语言包
  router.post('/trans', upload.any('file'), async (req, res) => {
    const uuid = req.headers.uuid
    const [file] = req.files
    const { filename, mark, website, name, lang, from, to } = req.body
    const result = await createTran({ uuid, file, filename, name, mark, website, lang, from, to })
    res.json(result)
  })

  // 合并语言包
  router.post('/trans/merge', async (req, res) => {
    const uuid = req.headers.uuid
    const { ids, mark, mainId } = req.body
    const result = await mergeTrans({ ids, mark, mainId, uuid })
    res.json(result)
  })

  // 下载语言包
  router.post('/trans/download', async (req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream')
    const { code, data, message } = await queryTran(req.body.id)
    if (code === -1) return { code, data, message }
    // const filePath = path.resolve(__dirname, './history.js')
    console.log(data)
    const cs = fs.createReadStream(data.savePath)
    cs.on('data', chunk => {
        res.write(chunk)
    })
    cs.on('end', () => {
        res.status(200)
        res.end()
    })
  })

  router.put('/trans/:id', upload.any('file'), async (req, res) => {
    const uuid = req.headers.uuid
    const [file] = req.files
    const { filename, mark, website, lang, from, to } = req.body
    const { id } = req.params
    const result = await updateTran({ id, file, filename, mark, website, lang, from, to, uuid })
    res.json(result)
  })

  router.get('/trans/online', async (req, res) => {
    const result = await transOnline(req.query)
    res.json(result)
  })

  router.get('/trans/:id', async (req, res) => {
    const { id } = req.params
    const result = await queryTran(id)
    res.json(result)
  })

  router.get('/trans', async (req, res) => {
    const uuid = req.headers.uuid
    const result = await queryTrans({ uuid })
    res.json(result)
  })

  router.delete('/trans/:id', async (req, res) => {
    const { id } = req.params
    const result = await delTran({ id })
    res.json(result)
  })

  router.get('/import-trans/:id', async (req, res) => {
    const { id } = req.params
    const result = await queryTran(id)
    res.json(result)
  })
}