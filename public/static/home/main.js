/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-24 17:11:18
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 16:26:55
 */

window.onload = () => {
  sr()
  i18n()
}

function sr() {
  const options = {
    reset: true,
    delay: 300,
    distance: '50px'
  }
  ScrollReveal(options)
    .reveal('.preview-item')

  ScrollReveal({ ...options, delay: 350 })
    .reveal('.preview-item h1')

  ScrollReveal(options)
    .reveal('.banner-content')

  ScrollReveal({ ...options, delay: 350 })
    .reveal('.banner-content section')
    
  ScrollReveal({ ...options, distance: '100px' })
    .reveal('.btn')
}

function getMessage(transId = '62187819dc62f124ebe45511') {
  return axios.get(`http://lang-api.zeroojs.com/import-trans/${transId}`)
}

function i18n() {
  const initLocale = localStorage.getItem('locale')
  const locale = initLocale ? initLocale.split('_')[0] : 'zh'
  const languageBtn = document.querySelector('.language-btn')
  if (locale === 'zh') return
  languageBtn.setAttribute('data-locale', 'zh')
  languageBtn.innerHTML = '简体中文'
  // 请求语言包
  getMessage()
    .then((res) => {
      return res.data.data.content
    })
    .then(translation => {
      return i18next.init({
        lng: locale,
        debug: false,
        resources: {
          zh: { translation }
        }
      })
        .then(t => translation)
    })
    .then(translation => {
      for (const key in translation) {
        const el = document.querySelector(`[data-text="${key}"]`)
        if (el) {
          el.innerHTML = i18next.t(translation[key])
        }
      }
    })
}

const languageBtn = document.querySelector('.language-btn')
languageBtn.addEventListener('click', (e) => {
    const locale = e.target.dataset.locale
    if (locale === 'en') {
      localStorage.setItem('locale', 'en_62187819dc62f124ebe45511')
      i18n()
      return
    }
    languageBtn.setAttribute('data-locale', 'en')
    localStorage.setItem('locale', 'zh')
    window.location.reload()
  })