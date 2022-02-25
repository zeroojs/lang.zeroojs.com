/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 09:25:19
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:49:46
 */
import { defineStore } from 'pinia'
import axios from 'axios'
import { request } from '../utils'
import i18n from '../utils/i18n'

export const useStore = defineStore('main', {
  state() {
    return {
      isLoginState: !!localStorage.getItem('x-token'),
      countries: [],
      langs: [],
      userInfo: {} // 账户信息
    }
  },
  getters: {
    allCountries: state => state.countries,
    allLangs: state => state.langs,
    user: state => state.userInfo,
    isLogin: state => state.isLoginState
  },
  actions: {
    async getCountries() {
      const { data } = await axios.get('/static/country.json')
      this.countries = data
    },
    async getLangs() {
      const { data } = await request.get('/lang')
      this.langs = data
    },
    async getProfile() {
      const { data, code } = await request.get('/user')
      if (code === 0) {
        this.isLoginState = true
        this.userInfo = data
      }
    }
  }
})

export const useLangStore = defineStore('lang', {
  state() {
    return {
      localeState: 'zh',
      transIdState: '',
      messageState: {}
    }
  },
  getters: {
    locale: state => state.localeState,
    message: state => state.messageState,
    transId: state => state.transIdState
  },
  actions: {
    setLocale({ locale, transId }) {
      let progeress = Promise.resolve({ content: {} })
      if (!(locale in this.message) && locale !== 'zh' && transId) {
        // 请求语言包
        progeress = this.getMessage(transId)
      }
      progeress.then(({ content }) => {
        if (Object.keys(content).length) {
          this.messageState = {
            ...this.messageState,
            [locale]: content
          }
        }
        content = this.messageState[locale]
        this.localeState = locale
        this.transIdState = transId
        localStorage.setItem('locale', transId ? `${locale}_${transId}` : locale)
        i18n.global.locale = locale
        i18n.global.setLocaleMessage(locale, content)
        document.querySelector('html').setAttribute('lang', locale)
      })
    },
    init() {
      const localeData = localStorage.getItem('locale')
      if (localeData) {
        const [locale, transId] = localeData.split('_')
        this.setLocale({ locale, transId })
      }
    },
    async getMessage(transId) {
      const result = await request.get(`/import-trans/${transId}`)
      if (result.code !== 0) return {}
      return result.data
    }
  }
})