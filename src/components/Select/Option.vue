<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 13:36:52
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-09 16:47:12
-->
<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  value: String,
  label: String
})

const emit = defineEmits(['click'])
const handleOptionClick = inject('handleOptionClick')
const selectedValue = inject('selectedValue')
const isActive = computed(() => selectedValue.value === props.value)

const handleLiClick = () => {
  handleOptionClick(props)
}
</script>
<template>
  <li :class="{ 'is-active': isActive }" class="select-option" @click.stop="handleLiClick()">
    <slot />
  </li>
</template>