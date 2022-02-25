<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 10:23:06
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:28:59
-->
<template>
  <div class="lang">
    <button class="btn small add-lang-btn" @click="openDialog()">{{ $t('添加语种') }}</button>
    <p>{{ $t('更多语种可查看：') }} <a href="http://api.fanyi.baidu.com/doc/21" target="_blank" class="lang-about-link">http://api.fanyi.baidu.com/doc/21</a></p>
    <table>
      <thead>
        <tr>
          <td>{{ $t('名称') }}</td>
          <td>{{ $t('关键字') }}</td>
          <td>{{ $t('上次修改时间') }}</td>
          <td>{{ $t('备注') }}</td>
          <td align="center">{{ $t('操作') }}</td>
        </tr>
      </thead>
      <tbody v-if="langs.length">
        <tr
          v-for="lang in langs"
          :key="lang.name"
        >
          <td>{{ lang.name }}</td>
          <td>{{ lang.value }}</td>
          <td>{{ formatDate(lang.updatedAt) }}</td>
          <td>{{ lang.mark || '/' }}</td>
          <td align="center">
            <button
              class="btn small"
              tag="button"
              @click="openDialog(lang)"
            >
              {{ $t('编辑') }}
            </button>
            <button class="btn small danger" @click="openDelDialog(lang)">
              {{ $t('删除') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Dialog v-model="visible">
    <input v-model="name" class="input lang-name-input" :placeholder="$t('名称')" />
    <input v-model="value" class="input" :placeholder="$t('引用名称')" />
    <textarea v-model="mark" class="input" :placeholder="$t('备注')" />
    <button class="btn small" @click="createLang()">{{ $t('确定') }}</button>
    <button class="btn small border" @click="visible = false">{{ $t('取消') }}</button>
  </Dialog>
  <Dialog
    v-model="delVisible"
    class="sm"
  >
    <p style="margin: 20px 0;line-height: 1.5em;">
      {{ $t('删除后将会导致您正在使用次语种的站点异常，') }}
      <br>
      {{ $t('确定删除该语种吗？') }}
    </p>
    <div class="flex center">
      <button class="btn small" @click="delLang()">{{ $t('确定删除') }}</button>
      <button class="btn small border" @click="delVisible = false">{{ $t('取消') }}</button>
    </div>
  </Dialog>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRefs  } from 'vue'
import { request, formatDate } from '../utils'
import { useStore } from '../store'
import { useNotify } from '../components/Notify'

const useLang = () => {
  const notify = useNotify()
  const store = useStore()
  const langs = computed(() => store.allLangs)
  const visible = ref(false)
  const delVisible = ref(false)
  const langId = ref('')
  const lang = reactive({
    name: '',
    value: '',
    mark: ''
  })

  const getLang = async () => {
    store.getLangs()
  }
  getLang()
  
  const createLang = async () => {
    let res = null
    if (langId.value) {
      res = await request.put(`/lang/${langId.value}`, lang)
    } else {
      res = await request.post('/lang', lang)
    }
    if (res.code === 0) {
      getLang()
      visible.value = false
    }
  }

  const delLang = async () => {
    await request.delete(`/lang/${langId.value}`)
    delVisible.value = false
    notify({ message: '已删除' })
    getLang()
  }
  const openDelDialog = (row) => {
    langId.value = row._id
    delVisible.value = true
  }

  const openDialog = (row) => {
    if (row) {
      langId.value = row._id
      lang.name = row.name
      lang.mark = row.mark
      lang.value = row.value
    } else {
      lang.name = ''
      lang.mark = ''
      lang.value = ''
      langId.value = ''
    }
    visible.value = true
  }
  return {
    ...toRefs(lang),
    langs,
    visible,
    delVisible,
    openDialog,
    createLang,
    delLang,
    openDelDialog
  }
}
  

export default defineComponent({
  setup() {
    return {
      ...useLang(),
      formatDate
    }
  }
})
</script>

<style scoped>
.lang-name-input,
table {
  margin-top: 20px;
}
.add-lang-btn {
  margin-bottom: 10px;
}
.lang-about-link {
  color: #6C63FF;
}
</style>