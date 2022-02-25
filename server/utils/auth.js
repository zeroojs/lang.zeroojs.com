/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-24 15:32:01
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:48:15
 */
const { decodeToken } = require('./token')
async function authMiddleware(req, res, next) {
  const noAuth = /\/login|\/import-trans/.test(req.url)
  if (noAuth) return next()
  const token = req.headers.authentication
  const valid = await decodeToken(token)
  if (valid.code === 0) {
    req.headers.uuid = valid.data
    return next()
  }
  res.statusCode = 401
  res.json(valid)
  return valid
}

module.exports = authMiddleware