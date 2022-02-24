<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-07 16:03:46
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-10 14:42:01
-->
<template>
  <div class="manage-edit">
    <TransEdit :tran-content="tranContent" :tran="tran" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import TransEdit from '../create.vue'
import { request, jsonToContent } from '../../utils'


const useTrans = () => {
  const tranContent = ref({
    origin: '',
    target: ''
  })
  const tran = ref({})
  const route = useRoute()
  const getTran = async () => {
    const { id } = route.params
    const res = await request(`/trans/${id}`)
    const { origin, target } = jsonToContent(res.data.content)
    const temp = { ...res.data }
    delete temp.content
    tran.value = temp
    tranContent.value = {
      origin,
      target,
      from: temp.from ? temp.from._id : '',
      to: temp.to ? temp.to._id : ''
    }
  }
  getTran()

  return { tran, tranContent }
} 

export default defineComponent({
  components: {
    TransEdit
  },
  setup() {
    const { tran, tranContent } = useTrans()
    return {
      tran,
      tranContent
    }
  }
})
</script>

<style lang="less" scoped>
</style>
