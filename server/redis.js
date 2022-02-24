/*
 * @Descripttion: Redis 
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-23 15:20:20
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-23 16:10:35
 * https://www.runoob.com/redis/redis-keys.html
 * D:\Softs\Redis-x64-5.0.14.1
 */
const redis = require('redis')
const { redis: redisConfig } = require('./config')
const { PORT, HOST, PASSWORD } = redisConfig

const RedisClient = redis.createClient({
  password: PASSWORD,
  socket: {
    port: PORT,
    host: HOST
  }
})

function redisBootstrap() {
  return RedisClient
    .connect()
    .then(() => RedisClient.ping())
    .then(() => {
      console.log('Redis connected!')
    })
}
exports.RedisClient = RedisClient
exports.redisBootstrap = redisBootstrap