/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 23:31:00
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 14:28:39
 */
const {
  fetchGithubProfile,
  fetchGiteeProfile,
  queryUser
} = require('../service/user.service')
const { decodeToken } = require('../utils/token')

module.exports = function useLoginRouter(router) {

  // github 用户信息
  router.get('/user/github', async (req, res) => {
    // console.log(req.headers)
    const result = await fetchGithubProfile(req.headers.authentication)
    res.json(result)
    // res.json(req.headers)
  })
  router.get('/user/gitee', async (req, res) => {
    // console.log(req.headers)
    const result = await fetchGiteeProfile(req.headers.authentication)
    res.json(result)
    // res.json(req.headers)
  })
  router.get('/user/sms', async (req, res) => {
    const result = await queryUser({
      token: req.headers.authentication
    }, { token: 0 })
    const { code, message } = await decodeToken(req.headers.authentication)
    if (code !== 0) {
      res.json({ code, message })
      return
    }
    const user = await queryUser({ _id: result.data._id })
    res.json(user)
  })
  // 获取用户信息
  router.get('/user', async (req, res) => {
    const { code, message, data } = await decodeToken(req.headers.authentication)
    if (code !== 0) {
      res.json({ code, message })
      return
    }
    const user = await queryUser({ _id: data })
    res.json(user)
  })
}