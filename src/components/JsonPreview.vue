<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 13:31:40
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-10 14:31:41
-->
<template>
  <div class="json-preview">
    <pre>{{ json }}</pre>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    json: { // json 字符串
      type: String,
      default: '123'
    }
  }
})
</script>
