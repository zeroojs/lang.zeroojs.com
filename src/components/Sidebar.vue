<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-07 13:27:46
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:15:25
-->
<template>
  <div class="sidebar">
    <Logo />
    <router-link
      v-for="menu in menus"
      :key="menu.value"
      :to="menu.value"
      class="sidebar-item"
    >
      {{ $t(menu.label) }}
    </router-link>
    <a
      v-show="isShowGuide"
      href=""
      class="sidebar-item"
      @click.prevent.stop="driverAction()"
    >
      {{ $t('使用指引') }}
    </a>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { createDriver } from '../utils'
import Logo from './Logo/index.vue'

const menus = [
  {
    value: '/new',
    label: '创建语言包'
  },
  {
    value: '/manage',
    label: '语言包管理'
  },
  {
    value: '/lang',
    label: '语种管理'
  }
]

const [{ value: defValue }] = menus
export default defineComponent({
  components: {
    Logo
  },
  emits: ['change'],
  setup(_, { emit }) {
    const route = useRoute()
    const selected = ref('')
    const isShowGuide = computed(() => route.path === '/new')

    const handleChange = ({ value }) => {
      selected.value = value
      sessionStorage.setItem('menu-value', value)
      emit('change', value)
    }
    handleChange({ value: sessionStorage.getItem('menu-value') || defValue })

    const driverAction = () => {
      const driver = createDriver()
      driver.start()
    }
    return {
      menus,
      selected,
      handleChange,
      driverAction,
      isShowGuide
    }
  }
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
  /* border-right: 1px solid #d9d9d9; */
  /* background-color: #6C63FF;
  color: #fff; */
}
.sidebar::before {
  content: " ";
  height: calc(100vh - 60px);
  width: 15px;
  background-color: #fff;
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 9;
  border-right: 1px solid #d9d9d9;
  transition: border-color .3s, box-shadow .3s;
}
.sidebar-item {
  padding: 12px;
  display: block;
  text-decoration: none;
  color: inherit;
  min-width: 250px;
  position: relative;
}
.sidebar-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 4px;
  background-color: #6C63FF;
  opacity: 0;
  transition: opacity .3s ease;
}
.sidebar-item.active,
.sidebar-item:hover {
  color: #6C63FF;
}
.sidebar-item.active::before {
  opacity: 1;
}
</style>
