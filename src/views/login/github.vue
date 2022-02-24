<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-22 00:02:53
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-22 00:02:53
-->
<template>
  <div class="login-github">
    {{ $route.path }}
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { request } from '../../utils'

export default defineComponent({
  setup() {
    const route = useRoute()
    const githubAuth = () => {
      request.get('/login/github', { params: route.query })
        .then(res => {
          console.log(res)
        })
    }
    githubAuth()
    return {
    }
  }
})
</script>

<style lang="less" scoped>
</style>
