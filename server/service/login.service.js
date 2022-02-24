/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 23:46:43
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 14:34:14
 */
const axios = require('axios')
const { customAlphabet } = require('nanoid')
const qs = require('querystring')
const { sendSms } = require('../utils/sms')
const { getToken } = require('../utils/token')
const { RedisClient } = require('../redis')
const { gitee } = require('../config')
const { createUser, queryUser, updateUser, fetchGiteeProfile } = require('./user.service')
const { CLIENT_ID, CLIENT_SECRET, SCOPE, REDIRECT_URL } = gitee

const request = axios.create({
  baseURL: 'https://github.com',
  timeout: 30 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.response.use(
  r => {
    if (r.data) {
      return typeof r.data === 'string' ? qs.parse(r.data) : r.data
    }
    return r.data
  }
)

module.exports = {
  // Github 登录
  githubLogin() {
    const dataStr = (new Date()).valueOf()
    //重定向到认证接口,并配置参数
    let path = 'https://github.com/login/oauth/authorize'
    path += '?client_id=' + CLIENT_ID
    path += '&scope=' + SCOPE
    path += '&state=' + dataStr
    return { code: 0, data: path, message: 'success' }
  },
  // Gitee 登录
  giteeLogin() {
    //重定向到认证接口,并配置参数
    let path = 'https://gitee.com/oauth/authorize'
    path += '?client_id=' + CLIENT_ID
    path += '&scope=' + SCOPE
    path += '&redirect_uri=' + REDIRECT_URL
    path += '&response_type=code'
    return { code: 0, data: path, message: 'success' }
  },
  // GitHub 回调认证
  async githubLoginAuth({ code }) {
    const params = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    }
    console.log('登陆中...', params)
    // console.log('params', params) // access_token=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&scope=user&token_type=bearer
    const result = await request
      .post('/login/oauth/access_token', params)
      .catch(err => {
        console.log('登录失败!')
        console.log('错误 CODE：', err.code)
        // console.log('错误：', err)
      })
    // console.log(result)
    if (!result) {
      return { code: -1, data: null, message: 'fail' }
    }
    console.log('认证成功!')
    // 更新用户信息
    console.log('登录成功!')
    return { code: 0, data: result, message: 'success' }
  },
  // Gitee 回调认证
  // https://gitee.com/api/v5/oauth_doc#/list-item-2
  async giteeLoginAuth({ code }) {
    const params = {
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URL,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    }
    // console.log('登陆中...', params)
    console.log('登陆中...')
    const result = await axios.post('https://gitee.com/oauth/token', params)
      .catch(err => {
        // console.log('请求错误：', err)
        console.log('请求错误状态码：', err.response.status)
        console.log('请求错误状态：', err.response.statusText)
        console.log('请求错误：', err.response.data)
        return { code: -1, ...err.response.data }
      })
    if (result.error) return result
    // data: {
    //   access_token: 'a2563e05832b3af406b77cf8df59f4cf',
    //   token_type: 'bearer',
    //   expires_in: 86400,
    //   refresh_token: '644086c84d9d204655778c20f1d0057d584199d2592853e16aa3f7d78fcaba8a',
    //   scope: 'user_info emails',
    //   created_at: 1645518225
    // }
    // console.log('result', result)
    console.log('登录成功', result.data)
    if (!result.data) return result
    // 拉取 gitee 授权用户信息
    const { data: giteeProfile } = await fetchGiteeProfile(result.data.access_token)
    const gitee = {
      user: giteeProfile,
      token: result.data
    }
    return loginAuth(gitee, 'gitee')
    // return { code: 0, data: result.data, message: 'success' }
  },
  // 发送登录短信验证码
  async sendLoginSmsVerifyCode({ phoneNumber }) {
    const resendKey = `sms_login_${phoneNumber}`
    const isResendExpire = await RedisClient.get(resendKey)
    if (isResendExpire === 1) return { code: -1, message: '30s 后可重新请求验证码!' }
    // const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)
    const nanoid = customAlphabet('1234567890', 4)
    const verifyCode = nanoid() // 验证码
    const sendResult = await sendSms(phoneNumber, verifyCode, 10)
    const { sendCode } = sendResult
    if (sendCode === -1) {
      return { code: -1, message: '发送失败' }
    }
    // 存 Redis 10 分钟有效
    const verifyCodeKey = `sms_login_${verifyCode}`
    await RedisClient.set(verifyCodeKey, phoneNumber)
    await RedisClient.expire(verifyCodeKey, 10 * 60) // 10 分钟有效期
    // 30s可重新请求
    await RedisClient.set(resendKey, 1)
    await RedisClient.expire(resendKey, 30) // 30 秒有效期
    return { code: 0, message: '验证码已发送' }
  },
  // 短信登录验证
  async smsLoginAuth({ phoneNumber, verifyCode }) {
    const verifyCodeKey = `sms_login_${verifyCode}`
    const penr = await RedisClient.get(verifyCodeKey)
    if (penr !== phoneNumber) {
      return { code: -1, message: '验证码错误' }
    }
    return loginAuth({ phoneNumber })
  }
}

async function loginAuth(filter = {}, type = 'sms') {
  // 创建用户
  let newUser = {}
  if (type === 'sms') {
    newUser = {
      phoneNumber: filter.phoneNumber,
      account: filter.phoneNumber
    }
  }
  if (type === 'gitee') {
    newUser = {
      account: filter.user.login,
      gitee: filter
    }
  }
  let result = {}
  const { data } = await queryUser({ account: newUser.account })
  let token = '' // 15天后过期
  if (data) {
    token = getToken(data._id)
    newUser.token = token
    result = await updateUser(newUser)
  } else {
    result = await createUser(newUser)
    token = getToken(result.data._id)
    newUser.token = token
    result = await updateUser(newUser)
  }
  const { code, message } = result
  if (code === 0) {
    return { code: 0, token, message: '登录成功' }
  }
  return { code: -1, message }
}