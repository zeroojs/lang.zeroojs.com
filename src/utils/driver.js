/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-10 15:41:01
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 18:07:04
 */
import Driver from 'driver.js'

export const createDriver = () => {
  const driver = new Driver({
    prevBtnText: '上一步',
    nextBtnText: '下一步',
    doneBtnText: '完成指引',
    closeBtnText: '关闭'
  })
  return {
    start() {
      driver.defineSteps([
        {
          element: '#origin-textarea',
          popover: {
            title: '在这里输入原文',
            description: '每段内容占一行'
          }
        },
        {
          element: '#target-textarea',
          popover: {
            title: '在这里输入译文',
            description: '每段内容占一行，并且要与原文一一对应'
          }
        },
        {
          element: '#origin-lang',
          popover: {
            title: '原文语种',
            description: ''
          }
        },
        {
          element: '#target-lang',
          popover: {
            title: '译文语种',
            description: ''
          }
        },
        {
          element: '#target-lang',
          popover: {
            title: '译文语种',
            description: ''
          }
        },
        {
          element: '.filename-input',
          popover: {
            title: '语言包名称',
            description: '用于标识语言包，站点也可用于请求语言包的标识'
          }
        },
        {
          element: '.filename-input',
          popover: {
            title: '语言包名称',
            description: '用于标识语言包，站点也可用于请求语言包的标识'
          }
        },
        {
          element: '.website-textarea',
          popover: {
            title: '使用站点',
            description: '输入要使用语言包的站点域名或IP、每个站点占一行'
          }
        },
        {
          element: '.trans-online-btn',
          popover: {
            title: '在线翻译',
            description: '基于百度翻译API实现，翻译内容会覆盖译文框中的内容'
          }
        },
        {
          element: '.preview-json-btn',
          popover: {
            title: '预览生成的JSON',
            description: '可查看根据原文框和译文框中内容生成的 JSON 数据（语言包）'
          }
        },
        {
          element: '.upload-json-btn',
          popover: {
            title: '上传本地 JSON文件',
            description: '可通过已有的语言包上传进行二次编辑'
          }
        },
        {
          element: '.submit-json-btn',
          popover: {
            title: '提交表单',
            description: '将数据提交至服务端生成语言包'
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
    prevBtnText: '上一步',
    nextBtnText: '下一步',
    doneBtnText: '完成指引',
    closeBtnText: '关闭'
  })
  return {
    start(transEle) {
      console.log('transEle', transEle)
      driver.defineSteps([
        {
          element: transEle,
          popover: {
            title: '点击图标设置主文件',
            description: '主文件只能在已选择合并的语言包中设置'
          }
        }
      ])
      driver.start()
    }
  }
}