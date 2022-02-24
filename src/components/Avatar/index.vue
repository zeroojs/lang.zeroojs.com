<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-23 22:04:00
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-23 22:22:06
-->
<template>
  <div ref="avatar" class="avatar" v-html="svg"></div>
</template>

<script setup>
import multiavatar from '@multiavatar/multiavatar/esm'
import { ref, watch } from 'vue'
import { useStore } from '../../store'
const store = useStore()
const svg = ref('')

watch(() => store.user.account, (v) => {
  svg.value = multiavatar(v || '')
})
</script>

<style lang="less" scoped>
.avatar {
  width: 30px;
  height: 30px;
  transition: box-shadow .3s;
  border-radius: 50%;
}
</style>
