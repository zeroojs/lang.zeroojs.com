<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 10:39:39
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-10 15:09:37
-->
<template>
  <div class="trans-textarea">
    <textarea 
      v-model="content" 
      v-bind="$attrs"
      class="trans-textarea__inner"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: [
    'update:modelValue'
  ],
  setup(props, { emit }) {
    const content = ref(props.modelValue)

    watch(() => content.value, (v) => {
      emit('update:modelValue', v)
    })

    watch(() => props.modelValue, (v) => {
      if (v) {
        content.value = v
      }
    }, { immediate: true })
    return {
      content
    }
  }
})
</script>

<style lang="less" scoped>
</style>
