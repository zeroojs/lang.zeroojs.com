/*
 * @Descripttion: Client Request Util
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 15:50:43
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 23:02:20
 */
import axios from 'axios'

export const request = axios.create({
  // baseURL: 'http://localhost:9527',
  baseURL: 'http://lang-api.zeroojs.com',
  headers: {
    'Content-Type': 'application/json',
    Authentication: ''
  }
})

request.interceptors.request.use(
  c => {
    const token = localStorage.getItem('x-token')
    if (token) {
      c.headers.Authentication = token
    }
    return c
  }
)

request.interceptors.response.use(
  r => r.data
)