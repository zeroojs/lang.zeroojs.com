/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 23:46:43
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 15:36:35
 */
const axios = require('axios')
const UserSchem = require('../schema/user')
// 解决 DEPTH_ZERO_SELF_SIGNED_CERT 错误
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 30 * 1000,
  headers: {
    // 'Content-Type': 'application/json'
  }
})

module.exports = {
  // 获取 Github 账户信息
  async fetchGithubProfile(token) {
    if (!token) return { code: -1, data: null, message: 'token invalid' }
    const params = {
      access_token: token
    }
    const result = await request.get('/user', {
      // params,
      headers: {
        Authorization: `token ${token.trim()}`
      }
    })
    .catch(err => {
      console.log('请求失败!')
      console.log('错误 CODE：', err.code)
    })
    if (!result) return { code: -1, data: null, message: 'request fail' }
    return { code: 0, data: result, message: 'success' }
  },
  // 获取 Gitee 账户信息
  async fetchGiteeProfile(token) {
    if (!token) return { code: -1, data: null, message: 'token invalid' }
    const result = await axios.get('https://gitee.com/api/v5/user', {
      params: {
        access_token: token
      }
    })
    if (!result) return { code: -1, data: null, message: 'request fail' }
    return { code: 0, data: result.data, message: 'success' }
  },
  // 创建用户
  async createUser(userInfo = {}) {
    const user = await UserSchem.findOne({ account: userInfo.account })
    if (user) {
      return { code: -1, data: null, message: '账户已存在' }
    }
    const newUser = await UserSchem.create(userInfo)
    return { code: 0, data: newUser, message: 'success' }
  },
  // 更新用户
  async updateUser(userInfo = {}) {
    const user = await UserSchem.findOne({ account: userInfo.account })
    if (!user) {
      return { code: -1, data: null, message: '账户不存在' }
    }
    const data = await UserSchem.updateOne({ account: userInfo.account }, { $set: userInfo })
    return { code: 0, data, message: 'success' }
  },
  // 查询用户
  async queryUsers() {
    const data = await UserSchem.find().sort({ createdAt: -1 })
    return { code: 0, data, message: 'success' }
  },
  // 查询用户
  async queryUser(filter = {}, options = { token: 0, 'gitee': 0 }) {
    const data = await UserSchem
      .findOne(filter, options)
    if (!data) return { code: -1, data: null, message: '未查询到该用户信息' }
    return { code: 0, data, message: 'success' }
  }
}