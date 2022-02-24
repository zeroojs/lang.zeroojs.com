/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 14:58:28
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-10 15:01:46
 */
import dayjs from 'dayjs'

export const formatDate = (d, format = 'YYYY/MM/DD HH:mm:ss') => {
  const date = new Date(d)
  return dayjs(date).format(format)
}