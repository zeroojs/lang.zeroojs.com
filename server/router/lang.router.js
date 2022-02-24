/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 09:48:30
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-10 17:52:33
 */
const {
  queryLangs,
  createLang,
  updateLang,
  delLang
} = require('../service/lang.service')

module.exports = function useLangRouter(router) {
  router.get('/lang', async (req, res) => {
    const uuid = req.headers.uuid
    const result = await queryLangs({ uuid })
    res.json(result)
  })
  
  router.post('/lang', async (req, res) => {
    const uuid = req.headers.uuid
    const result = await createLang({ ...req.body, uuid })
    res.json(result)
  })
  
  router.put('/lang/:id', async (req, res) => {
    const uuid = req.headers.uuid
    const result = await updateLang({ ...req.params, ...req.body, uuid })
    res.json(result)
  })

  router.delete('/lang/:id', async (req, res) => {
    const result = await delLang(req.params)
    res.json(result)
  })
}