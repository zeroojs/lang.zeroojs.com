<!--
 * @Descripttion: 语种管理
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-07 13:55:43
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-21 23:08:59
-->
<template>
  <div class="manage-trans">
    <div class="header">
      <button
        class="btn small"
        :class="{ disabled: selecteds.length < 2 }"
        @click="mergeVisible = true"
      >
        合并语言包
      </button>
      <!-- <p class="merge-tips">* 若您未设置主文件，则会以选择的最后一个语言包作为主文件</p> -->
    </div>
    <table ref="table">
      <thead>
        <tr>
          <!-- <td>名称</td> -->
          <td>
            <input v-model="selectedAll" type="checkbox" @change="handleSelectedAll(trans)" />
          </td>
          <td>HASH</td>
          <td>站点</td>
          <td>语种</td>
          <td>状态</td>
          <td>合并文件</td>
          <td>上次修改时间</td>
          <td>备注</td>
          <td align="center">操作</td>
        </tr>
      </thead>
      <tbody v-if="trans.length">
        <tr
          v-for="tran in trans"
          :key="tran.name"
          :class="{ 
            'is-selected': selecteds.includes(tran._id),
            'is-main': mainTransId === tran._id
          }"
        >
          <!-- <td>{{ tran.name }}</td> -->
          <td>
            <input type="checkbox" @change="handleSelected(tran)" />
          </td>
          <td>
            <div class="flex">
              <a
                :id="`main-select-${tran._id}`"
                href=""
                class="main-select"
                @click.prevent="handleMainSelected(tran)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M4.873 3h14.254a1 1 0 0 1 .809.412l3.823 5.256a.5.5 0 0 1-.037.633L12.367 21.602a.5.5 0 0 1-.734 0L.278 9.302a.5.5 0 0 1-.037-.634l3.823-5.256A1 1 0 0 1 4.873 3z"/>
                </svg>
              </a>
              <span>{{ tran._id }}</span>
              <a href="" @click.prevent="handleClipboard(tran._id, $event)">
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"/>
                </svg>
              </a>
            </div>
          </td>
          <td>
            <div
              v-for="website in tran.website"
              :key="website"
            >
              <a :href="`https://${website}`" target="_blank" class="website-link">{{ website }}</a>
            </div>
          </td>
          <td v-if="tran.lang">
            {{ tran.lang.name }}（{{ tran.lang.value }}）
          </td>
          <td v-else>&nbsp;</td>
          <td>{{ formatStatus(tran.status) }}</td>
          <td align="center">{{ tran.isMerge ? '是' : '否' }}</td>
          <td>{{ formatDate(tran.updatedAt) }}</td>
          <td>{{ tran.mark || '无' }}</td>
          <td style="min-width: 300px">
            <div class="flex center">
              <router-link
                :to="`/manage/${tran._id}`"
                class="btn small"
                tag="button"
              >
                编辑
              </router-link>
              <button class="btn small border" @click="downloadJson(tran)">
                下载
              </button>
              <button class="btn small danger" @click="delConfirm(tran)">
                删除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Dialog
    v-model="visible"
  >
    <p style="margin: 20px 0">
      删除后将会导致您正在使用的站点异常，
      <br>
      确定删除 [ {{ tran._id }} ] 语言包吗？
    </p>
    <div class="flex center">
      <button class="btn small" @click="delTrans()">确定删除</button>
      <button class="btn small border" @click="visible = false">取消</button>
    </div>
  </Dialog>
  <Dialog v-model="mergeVisible">
    <p class="merge-dialog-tips">
      将多个语言包合并为一个语言包，重复字段、语种以主文件为准。
      <br>
      <span class="merge-tips">
        若您未设置主文件，则会以选择的最后一个语言包作为主文件。
      </span>
      <br>
      <a href="" @click.stop.prevent="handleGuideClick()">点我了解如何设置主文件</a>
    </p>
    <textarea
      v-model="mergeMark"
      type="text"
      class="input"
      placeholder="语言包备注"
    />
    <div class="flex center">
      <button class="btn small" @click="mergeTrans()">合并</button>
      <button class="btn small border" @click="mergeVisible = false">取消</button>
    </div>
  </Dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { request, formatDate, handleClipboard, setMainTransDriver } from '../../utils'
import { useNotify } from '../../components/Notify'

const useTrans = () => {
  const notify = useNotify()
  const trans = ref([])
  const tran = ref({})
  const visible = ref(false)
  const mergeVisible = ref(false)
  const mergeMark = ref('')
  const {
    table,
    selecteds,
    mainTransId,
    handleSelected,
    selectedAll,
    handleSelectedAll,
    handleMainSelected,
    clearSelectedAll,
    handleGuideClick
  } = useTable()

  const getTrans = async () => {
    const res = await request.get('/trans')
    trans.value = res.data
  }
  getTrans()

  const delTrans = async () => {
    const result = await request.delete(`/trans/${tran.value._id}`)
    if (result.code === 0) {
      visible.value = false
      notify({ message: '已删除' })
      getTrans()
      return
    }
    notify(result)
  }
  const delConfirm = (row) => {
    tran.value = row
    visible.value = true
  }

  // 下载语言包
  const downloadJson = async ({ _id, lang }) => {
    const data = await request.post('/trans/download', { id: _id }, {
      responseType: 'blob'
    })
    const blob = new Blob([data]) // 处理文档流
    const fileName = `${lang.value}_${_id}.json`
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  }

  // 合并语言包
  const mergeTrans = async () => {
    if (selecteds.value.length < 2) return
    const params = {
      ids: selecteds.value,
      mainId: mainTransId.value,
      mark: mergeMark.value
    }
    const result = await request.post('/trans/merge', params)
    if (result.code === 0) {
      mergeVisible.value = false
      mergeMark.value = ''
      clearSelectedAll()
      notify({ message: '合并完成！' })
      getTrans()
    }
  }

  const formatStatus = (statusCode) => {
    switch (statusCode) {
      case 'ready':
        return '原文已准备就绪'
      case 'editing':
        return '编辑中'
      case 'finish':
        return '已完成'
      default: {
        return '语言包异常' // exception
      }
    }
  }
  return {
    tran,
    trans,
    visible,
    delTrans,
    delConfirm,
    downloadJson,
    formatStatus,
    table,
    selecteds,
    mainTransId,
    selectedAll,
    handleSelected,
    handleSelectedAll,
    handleMainSelected,
    mergeTrans,
    mergeVisible,
    mergeMark,
    handleGuideClick
  }
}

const useTable = () => {
  const notify = useNotify()
  const selecteds = ref([])
  const selectedAll = ref(false)
  const mainTransId = ref('') // 主文件
  const table = ref()

  // 单项选择
  const handleSelected = ({ _id }) => {
    const checkboxs = table.value.querySelectorAll('tbody input[type="checkbox"]')
    if (selecteds.value.includes(_id)) {
      selecteds.value = selecteds.value.filter(v => v !== _id)
      // 如果设置了主文件也取消主文件选择
      if (mainTransId.value === _id) {
        mainTransId.value = ''
      }
      // 选中为空时全部选中为 false
      if (selecteds.value.length < checkboxs.length) {
        selectedAll.value = false
      }
      return
    }
    selecteds.value.push(_id)
    if (selecteds.value.length === checkboxs.length) {
      selectedAll.value = true
    }
  }

  // 选择全部
  const handleSelectedAll = (all = []) => {
    if (!table.value) return
    const checkboxs = table.value.querySelectorAll('tbody input[type="checkbox"]')
    
    if (selectedAll.value) {
      selecteds.value = all.map(i => i._id)
      if (checkboxs.length) {
        checkboxs.forEach(c => {
          c.checked = true
        })
      }
      return
    }
    selecteds.value = []
    if (checkboxs.length) {
      checkboxs.forEach(c => {
        c.checked = false
      })
    }
  }

  // 取消选择全部
  const clearSelectedAll = () => {
    if (!table.value) return
    const checkboxs = table.value.querySelectorAll('tbody input[type="checkbox"]')
    selecteds.value = []
    selectedAll.value = false
    mainTransId.value = ''
    if (checkboxs.length) {
      checkboxs.forEach(c => {
        c.checked = false
      })
    }
  }

  // 选择主文件
  const handleMainSelected = ({ _id }) => {
    if (!selecteds.value.includes(_id)) {
      notify({ message: '主文件只能存在于需要合并的语言包中！' })
      return
    }
    mainTransId.value = mainTransId.value === _id ? '' : _id
  }

  // 设置主文件引导
  const handleGuideClick = () => {
    const [id] = selecteds.value
    const driver = setMainTransDriver()
    driver.start(`#main-select-${id}`)
  }

  return {
    table,
    selecteds,
    selectedAll,
    mainTransId,
    handleSelected,
    handleSelectedAll,
    handleMainSelected,
    clearSelectedAll,
    handleGuideClick
  }
}

export default defineComponent({
  setup() {
    return {
      ...useTrans(),
      formatDate,
      handleClipboard,
      setMainTransDriver
    }
  }
})
</script>

<style scoped>
.website-link {
  color: inherit;
}
.website-link:hover {
  color: #6C63FF;
}
.header {
  margin-bottom: 20px;
}
.merge-tips {
  margin-top: 10px;
  color: #F56C6C;
}
.merge-dialog-tips {
  margin: 20px 0;
  text-align: left;
}
.merge-dialog-tips a {
  color: #6C63FF;
  margin-top: 10px;
  display: inline-block;
}
.flex {
  display: flex;
  height: auto;
  align-items: center;
}
.flex.center {
  justify-content: center;
}
.flex svg {
  margin-left: 6px;
  fill: #6b6a6a;
  cursor: pointer;
  pointer-events: none;
}
.flex a:hover svg {
  fill: #6C63FF;
}
.main-select svg {
  margin-left: 0;
  margin-right: 6px;
}
.is-main .main-select svg {
  fill: #6C63FF;
}
.is-main .main-select + span {
  color: #6C63FF;
}
</style>