/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-24 17:11:18
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 18:45:59
 */

window.onload = () => {
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