/*
 * @Descripttion: Project Config
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 10:37:58
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 09:48:40
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const __DEV__ = mode === 'development'
  const alias = {
      '@/': `${resolve(__dirname, 'src')}/`,
  }
  if (__DEV__) {
    // 解决警告You are running the esm-bundler build of vue-i18n.
      alias['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js'
  }
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias
    }
  })
}
