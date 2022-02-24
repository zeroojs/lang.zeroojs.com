<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-09 13:36:40
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:33:33
-->
<template>
  <div class="select">
    <input
      v-model="selected.label"
      readonly
      class="input"
      v-bind="$attrs"
      @click.stop="showOptions()"
    />
    <transition name="slide-down">
      <ul
        v-show="isShowOptions"
        class="select-options"
      >
        <slot />
      </ul>
    </transition>
  </div>
</template>

<script>
import { computed, defineComponent, provide, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const selected = ref({
      value: ''
    })
    const isShowOptions = ref(false)
    const selectedValue = computed(() => selected.value.value)
    provide('selectedValue', selectedValue)

    function hideOptions() {
      isShowOptions.value = false
      document.removeEventListener('click', hideOptions, false)
    }

    const handleOptionClick = (val) => {
      selected.value = val
      emit('update:modelValue', val.value)
      hideOptions()
    }
    provide('handleOptionClick', handleOptionClick)

    const showOptions = () => {
      isShowOptions.value = true
      document.addEventListener('click', hideOptions)
    }

    watch(() => props.modelValue, (v) => {
      if (v) {
        const [{ children }] = slots.default()
        const el = children.find(({ props }) => props.value === v)
        if (!el) return
        selected.value = el.props || {}
      }
    }, { immediate: true })

    return {
      selected,
      isShowOptions,
      showOptions
    }
  }
})
</script>

<style lang="less">
.select {
  position: relative;
  height: 40px;
  z-index: 1;
  margin: auto;
  max-width: 450px;
}
.select-options {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  z-index: 2;
  transition: border .2s ease;
  display: block;
  cursor: pointer;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.select-option {
  list-style-type: none;
  padding: 10px;
  margin: 0;
  border: 1px solid #d9d9d9;
  &:not(:first-child) {
    border-top: unset;
  }
  &:first-child {
    border-radius: 3px 3px 0 0;
  }
  &:last-child {
    border-radius: 0 0 3px 3px;
  }
  &:hover,
  &.is-active {
    background-color: fade(#6C63FF, 10);
  }
}
.slide-down-enter-active {
  animation: translateAnimate .2s ease-in forwards reverse;
}
.slide-down-leave-active {
  animation: translateAnimate .3s ease forwards;
}

@keyframes translateAnimate {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10%);
  }
}
</style>
