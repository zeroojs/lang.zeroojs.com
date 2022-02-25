/*
 * @Descripttion: 国际化工具
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-25 09:38:04
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 10:39:05
 */
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {},
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

export default i18n