/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 23:31:00
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-23 21:12:11
 */
const {
  githubLogin,
  githubLoginAuth,
  giteeLogin,
  giteeLoginAuth,
  sendLoginSmsVerifyCode,
  smsLoginAuth
} = require('../service/login.service')

module.exports = function useLoginRouter(router) {

  // github 登录
  router.post('/login/github', (req, res) => {
    res.json(githubLogin())
  })

  router.get('/login/github', async (req, res) => {
    const result = await githubLoginAuth(req.query)
    res.json(result)
  })

  // gitee 登录
  router.post('/login/gitee', (req, res) => {
    res.json(giteeLogin())
  })

  router.get('/login/gitee', async (req, res) => {
    const result = await giteeLoginAuth(req.query)
    res.json(result)
  })

  // 发送短信登录验证码
  router.get('/login/sms/send', async (req, res) => {
    const result = await sendLoginSmsVerifyCode(req.query)
    res.json(result)
  })
  
  // 手机短信登录
  router.post('/login/sms', async (req, res) => {
    const result = await smsLoginAuth(req.body)
    res.json(result)
  })
}