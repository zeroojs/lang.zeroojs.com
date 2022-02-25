/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 15:41:01
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 16:50:28
 */
import Driver from 'driver.js'
import i18n from './i18n'
const { t } = i18n.global

export const createDriver = () => {
  const driver = new Driver({
    prevBtnText: t('上一步'),
    nextBtnText: t('下一步'),
    doneBtnText: t('完成指引'),
    closeBtnText: t('关闭')
  })
  return {
    start() {
      driver.defineSteps([
        {
          element: '#origin-textarea',
          popover: {
            title: t('在这里输入原文'),
            description: t('每段内容占一行')
          }
        },
        {
          element: '#target-textarea',
          popover: {
            title: t('在这里输入译文'),
            description: t('每段内容占一行，并且要与原文一一对应')
          }
        },
        {
          element: '#origin-lang',
          popover: {
            title: t('原文语种'),
            description: ''
          }
        },
        {
          element: '#target-lang',
          popover: {
            title: t('译文语种'),
            description: ''
          }
        },
        {
          element: '#target-lang',
          popover: {
            title: t('译文语种'),
            description: ''
          }
        },
        {
          element: '.filename-input',
          popover: {
            title: t('语言包名称'),
            description: t('用于标识语言包，站点也可用于请求语言包的标识')
          }
        },
        {
          element: '.filename-input',
          popover: {
            title: t('语言包名称'),
            description: t('用于标识语言包，站点也可用于请求语言包的标识')
          }
        },
        {
          element: '.website-textarea',
          popover: {
            title: t('使用站点'),
            description: t('输入要使用语言包的站点域名或IP、每个站点占一行')
          }
        },
        {
          element: '.trans-online-btn',
          popover: {
            title: t('在线翻译'),
            description: t('基于百度翻译API实现，翻译内容会覆盖译文框中的内容')
          }
        },
        {
          element: '.preview-json-btn',
          popover: {
            title: t('预览生成的JSON'),
            description: t('可查看根据原文框和译文框中内容生成的 JSON 数据（语言包）')
          }
        },
        {
          element: '.upload-json-btn',
          popover: {
            title: t('上传本地 JSON文件'),
            description: t('可通过已有的语言包上传进行二次编辑')
          }
        },
        {
          element: '.submit-json-btn',
          popover: {
            title: t('提交表单'),
            description: t('将数据提交至服务端生成语言包')
          }
        }
      ])
      driver.start()
    }
  }
}

// 设置主文件引导
export const setMainTransDriver = () => {
  const driver = new Driver({
    prevBtnText: t('上一步'),
    nextBtnText: t('下一步'),
    doneBtnText: t('完成指引'),
    closeBtnText: t('关闭')
  })
  return {
    start(transEle) {
      driver.defineSteps([
        {
          element: transEle,
          popover: {
            title: t('点击图标设置主文件'),
            description: t('主文件只能在已选择合并的语言包中设置')
          }
        }
      ])
      driver.start()
    }
  }
}