# 语言包管理器
> 由于我公的多个站点需要做国际化，在本地做语言包繁琐且效率不高。于是这个小项目就出现了。此项目是由我司内部项目变种而来的，提供给有需要的朋友。也希望朋友们测试出bug可以想我反馈，提交issue。相互学习！

<a href="http://lang.zeroojs.com" target="_blank">项目在线地址：http://lang.zeroojs.com</a>

## 技术栈
+ 客户端
  + vite
  + vue3
  + pinia
  + driver.js
  + ScrollReveal.js

+ 服务端
  + express
  + mongoose
  + redis
  + jwt
  + Auth 2.0

你可以通过这个小项目了解`mongoose`的CRUD，了解`Redis`对于短信验证码的使用，也可以了解如何写一个基础的`express`中间件。在最近很火的`pinia`状态管理也使用到了，结合`vue3`的确不错。

## config 文件目录及其结构
> 此文件包含大量隐私数据，没有提交。以此方式展示，感兴趣的朋友可以替换对应数据以便启动项目测试。

```js
// /server/config.js
// Github API
const github = {
  SCOPE: ['user'],
  CLIENT_ID: '',
  CLIENT_SECRET: ''
}

// Gitee API
const gitee = {
  SCOPE: ['user_info'],
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  REDIRECT_URL: ''
}

// 百度 API
const baidu = {
  APP_ID: '',
  APP_KEY: ''
}

// 腾讯云 SMS
const tencent = {
  SECRET_ID: '',
  SECRET_KEY: '',
  SMS_SDK_APP_ID: '',
  SIGN_NAME: '',
  TEMPLATE_ID: ''
}

// 远程数据库
const DB_ADDRESS = ''

// Redis
const redis = {
  PORT: 6379,
  PASSWORD: '',
  HOST: '127.0.0.1'
}

module.exports = {
  github,
  gitee,
  baidu,
  tencent,
  redis,
  DB_ADDRESS
}
```

## 本地调试
```bash
# 启动客户端
yarn dev:client
# 启动服务端
yarn dev:serve
# 启动redis服务
yarn redis:serve
```
特别地：建议先启动redis服务再启动服务端。

# 相关连接
B 站（更新及其慢）：
https://space.bilibili.com/312560237/  
个人博客（近期重写了，聚合了掘金前端沸点）：
http://zeroojs.com