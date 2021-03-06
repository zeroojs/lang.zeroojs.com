/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 10:37:58
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 09:45:25
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './utils/i18n'
import App from './App.vue'
import Dialog from './components/Dialog.vue'
import Select from './components/Select'

import './style/index.css'
import './style/button.css'
import './style/input.css'
import './style/checkbox.css'
import './style/table.css'
import 'driver.js/dist/driver.min.css'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .use(i18n)
  .use(Select)
  .component('Dialog', Dialog)
  .mount('#app')
