/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 09:48:17
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-22 00:37:34
 */
const useTransRouter = require('./trans.router')
const useLangRouter = require('./lang.router')
const useLoginRouter = require('./login.router')
const useUserRouter = require('./user.router')
const router = require('express').Router()
useTransRouter(router)
useLangRouter(router)
useLoginRouter(router)
useUserRouter(router)

module.exports = router