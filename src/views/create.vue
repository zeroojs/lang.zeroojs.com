<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 10:37:58
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:33:06
-->
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import TransTextarea from '../components/TransTextarea.vue'
import JsonPreview from '../components/JsonPreview.vue'
import { reactive, ref, watch, computed } from 'vue'
import { formatJson, request, jsonToContent, verifyTargetContent } from '../utils'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../store'
import { useNotify } from '../components/Notify'

const props = defineProps({
  tran: {
    type: Object,
    default: () => Object.create({})
  },
  tranContent: {
    type: Object,
    default: () => Object.create({})
  }
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const notify = useNotify()

const isPut = computed(() => !!route.params.id)
// const countries = computed(() => store.allCountries)
const langs = computed(() => store.allLangs)
const viewValue = ref('')
const handleViewValueChange = (v) => {
  viewValue.value = v
}

const fileInput = ref()
const jsonContent = ref('')
const loading = ref(false)
const formData = reactive({
  originContent: '',
  targetContent: '',
  filename: '',
  name: '',
  // lang: '',
  from: '', // 原文语种
  to: '', // 译文语种
  website: '', // 站点
  mark: '' // 备注
})


watch(() => props.tranContent, (val) => {
  if (val && val.origin) {
    const { target, origin } = val
    formData.targetContent = target
    formData.originContent = origin
    formData.name = props.tran.name
    formData.website = (props.tran.website || []).join('\n')
    formData.mark = props.tran.mark
    formData.to = props.tran.to
    formData.from = props.tran.from
  }
}, { deep: true })

watch(() => langs.value, (val) => {
  if (val.length) {
    formData.from = val[0]._id
    formData.to = val[0]._id
  }
}, { immediate: true })

// 表单校验
const formValidate = () => {
  const { originContent } = formData
  if (!originContent) {
    return { valid: false, message: '原文内容不能为空' }
  }
  // if (!name) {
  //   return { valid: false, message: '文件名称不能为空' }
  // }
  return { valid: true }
}
const validate = () => {
  const { message, valid: formValid } = formValidate()
  if (!formValid) {
    notify({ message })
    return false
  }
  const { originContent, targetContent } = formData
  const validFomat = verifyTargetContent(originContent, targetContent)
  if (!validFomat) {
    notify({ message: '译文格式错误' })
    return false
  }
  return validFomat
}

// 生成 JSON 文件内容
const genJsonContent = (minify = false) => {
  if (!validate()) return
  jsonContent.value = formatJson(formData.originContent, formData.targetContent, { minify })
}

// 字符串转 File -> JSON
const genFile = (content = '123', filename = 'test.txt') => {
  const blob = new Blob([content], {
    type: 'text/plain'
  })
  return new File([blob], filename)
}

// 上传 JSON 文件数据
const uploadTransContent = async () => {
  if (!validate()) return
  const content = formatJson(formData.originContent, formData.targetContent, { minify: true })
  const file = genFile(content, `${formData.filename}.json`)
  loading.value = true
  const form = new FormData()
  const website = formData.website ? formData.website.split('\n') : []
  form.append('file', file)
  form.append('name', formData.name)
  form.append('filename', `${formData.name}.json`)
  form.append('website', website)
  form.append('mark', formData.mark)
  form.append('lang', formData.to)
  form.append('to', formData.to)
  form.append('from', formData.from)
  let result = null
  if (isPut.value) {
    result = await request.put(`/trans/${route.params.id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } else {
    result = await request.post('/trans', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  loading.value = false
  if (result.code === 0) {
    router.push('/manage/list')
    return
  }
  notify({ message: result.message })
}

// 监听文件变化
const handleFileInputChange = (e) => {
  const [file] = e.target.files
  formData.filename = file.name
  formData.name = file.name.replace(/\.(js|json)$/, '')
  const fileReader = new FileReader()
  fileReader.readAsText(new Blob([file]))
  fileReader.onload = function() {
    if (/javascript/.test(file.type)) {
      // 解析js脚本
    }
    if (/json/.test(file.type)) {
      // 解析json脚本
      const { origin, target } = jsonToContent(JSON.parse(this.result))
      formData.originContent = origin
      formData.targetContent = target
    }
  }
}

// 自动翻译
const visible = ref(false)
const transOnline = async () => {
  const { message, valid: formValid } = formValidate()
  if (!formValid) {
    notify({ message })
    return false
  }
  if (!visible.value && formData.targetContent.trim()) {
    visible.value = true
    return
  }
  const fromLang = store.allLangs.find(item => formData.from === item._id)
  const toLang = store.allLangs.find(item => formData.to === item._id)
  const result = await request.get('/trans/online', {
    params: {
      from: fromLang.value,
      to: toLang.value,
      q: formData.originContent
    }
  })
  if (result.code === 0) {
    const content = result.data.content.map(item => item.dst)
    formData.targetContent = content.join('\n')
    visible.value = false
    return
  }
  notify({ message: result.message })
}
</script>

<template>
  <div class="trans-group">
    <div class="trans-group-item">
      <TransTextarea
        v-model="formData.originContent"
        placeholder="请输入原文内容"
        id="origin-textarea"
      />
    </div>
    <div class="trans-group-item">
      <TransTextarea
        v-model="formData.targetContent"
        placeholder="请输入译文内容"
        id="target-textarea"
      />
    </div>
  </div>
  <form>
    <div class="trans-group">
      <div class="trans-group-item">
        <div class="select-group flex">
          <Select v-model="formData.from" id="origin-lang" placeholder="请添加语种">
            <Option
              v-for="lang in langs"
              :key="lang._id"
              :value="lang._id"
              :label="`${lang.name}（${lang.value}）`"
              class="select-option"
            >
              {{ lang.name }}（{{ lang.value }}）
            </Option>
          </Select>
          <span>></span>
          <Select v-model="formData.to" id="target-lang" placeholder="请添加语种">
            <Option
              v-for="lang in langs"
              :key="lang._id"
              :value="lang._id"
              :label="`${lang.name}（${lang.value}）`"
              class="select-option"
            >
              {{ lang.name }}（{{ lang.value }}）
            </Option>
          </Select>
        </div>
      </div>
      <!-- <label class="trans-group-item">
        <input v-model="formData.name" type="text" class="input filename-input" placeholder="请输入文件名称">
      </label> -->
    </div>
    <div class="trans-group">
      <label class="trans-group-item">
        <textarea
          v-model="formData.website"
          type="text"
          class="input website-textarea"
          placeholder="请输入使用站点，站点之间换行"
        />
      </label>
      <label class="trans-group-item">
        <textarea
          v-model="formData.mark"
          type="text"
          class="input"
          placeholder="语言包备注"
        />
      </label>
    </div>
  </form>
  <div align="center">
    <button class="btn border trans-online-btn" @click.stop="transOnline()">开始翻译</button>
    <button class="btn border preview-json-btn" @click="genJsonContent()">预览 JSON</button>
    <!-- <button class="btn" @click="genJsonContent(true)">预览压缩后的 JSON</button> -->
    <button class="btn border upload-json-btn" @click="fileInput.click()">上传 JSON</button>
    <button class="btn submit-json-btn" @click="uploadTransContent()">
      {{ isPut ? '更新' : '创建' }}语言包
    </button>
  </div>
  <JsonPreview v-show="jsonContent" :json="jsonContent" />
  <input
    type="file"
    accept=".json,.js"
    ref="fileInput"
    style="display:none"
    @change="handleFileInputChange"
  />
  <Dialog
    v-model="visible"
  >
    <p style="margin: 20px 0">
      您的译文内容不为空，在线翻译将覆盖译文内容。
      <br>
      确定继续使用在线翻译吗？
    </p>
    <div class="flex">
      <button class="btn small" @click="transOnline()">确定</button>
      <button class="btn small border" @click="visible = false">取消</button>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
.trans-group-item .input {
  margin: auto;
}
.select-group {
  display: flex;
  max-width: 450px;
  margin: auto;
  align-items: center;
  justify-content: space-between;
  .select {
    margin: unset;
  }
}
</style>