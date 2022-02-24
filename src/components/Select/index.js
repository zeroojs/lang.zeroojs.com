/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 13:50:05
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-09 13:51:12
 */
import Select from './index.vue'
import Option from './Option.vue'

export default {
  install(app) {
    app.component('Select', Select)
    app.component('Option', Option)
  }
}