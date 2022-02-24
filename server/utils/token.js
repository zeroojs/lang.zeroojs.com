/*
 * @Descripttion: Token Util
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-23 16:40:30
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 15:37:03
 */
const ms = require('ms')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')

function getToken(data, exp = '15d') {
  const slat = nanoid()
  const token = jwt.sign({
    data,
    exp: Math.floor(Date.now() / 1000) + ms(exp),
  }, slat)
  return `${token}.${slat}`
}
 
function decodeToken(token = '') {
  const slat = token.substring(token.lastIndexOf('.') + 1)
  token = token.substring(0, token.lastIndexOf('.'))
  return new Promise(resolve => {
    jwt.verify(token, slat, (err, decoded) => {
      if (err) {
        // -1 过期 | -2 无法验证
        let code = err.message === 'jwt expired' ? -1 : -2
        resolve({ code, message: err.message })
        return
      }
      resolve({ code: 0, ...decoded })
      // { code: 0, data: 'hehe', exp: 2941609017, iat: 1645609017 }
    })
  })
}

exports.getToken = getToken
exports.decodeToken = decodeToken

// console.log(getToken('hehe'))
// decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaGVoZSIsImV4cCI6Mjk0MTY3MzgwNiwiaWF0IjoxNjQ1NjczODA2fQ.EqTaVlijGrlBY4-s9MeB282FZsZUb3K6LhZWnkGD_xs.EWgk1PMOQe-YbYHIAWSt6')
//   .then(res => {
//     console.log(res)
//   })

// console.log(ms('15 d') / 1000)