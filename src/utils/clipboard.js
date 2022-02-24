/*
 * @Descripttion: 复制插件
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-21 14:13:59
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 14:17:24
 */
import Clipboard from 'clipboard'
import { useNotify } from '../components/Notify'

function clipboardSuccess() {
  const notify = useNotify()
  notify({
    message: '复制成功！',
    type: 'success',
    duration: 1500
  })
}

function clipboardError() {
  const notify = useNotify()
  notify({
    message: '复制失败！',
    type: 'error'
  })
}

export function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
