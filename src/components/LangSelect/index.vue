<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-25 16:30:15
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 16:33:32
-->
<script setup>
import { ref, watch } from 'vue'
import { useLangStore } from '../../store'
const langStore = useLangStore()
const localeVal = ref('')

const changeLanguage = ({ value }) => {
  const [locale, transId] = value.split('_')
  langStore.setLocale({ locale, transId })
}

watch(() => langStore.locale, (val) => {
  if (val !== 'zh') {
    localeVal.value = `${val}_${langStore.transId}`
    return
  }
  localeVal.value = val
}, { immediate: true })
</script>
<template>
  <Select v-model="localeVal" @change="changeLanguage">
    <Option value="zh" label="中文">中文</Option>
    <Option value="en_62187819dc62f124ebe45511" label="English">English</Option>
  </Select>
</template>

<style lang="less" scoped>
</style>
