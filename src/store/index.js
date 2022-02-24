/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 09:25:19
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 15:54:34
 */
import { defineStore } from 'pinia'
import axios from 'axios'
import { request } from '../utils'

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