<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-01-18 10:37:58
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-25 14:09:10
-->
<script>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar/index.vue'
import { computed, defineComponent, ref } from 'vue'
import { useLangStore, useStore } from './store'

export default defineComponent({
  components: {
    Sidebar,
    Navbar
  },
  setup() {
    const isLogin = computed(() => store.isLogin)
    const viewValue = ref('create')
    const handleViewValueChange = (v) => {
      viewValue.value = v
    }

    const store = useStore()
    const langStore = useLangStore()
    if (store.isLogin) {
      store.getProfile()
      store.getLangs()
    }
    langStore.init()

    return {
      isLogin,
      viewValue,
      handleViewValueChange
    }
  }
})
</script>

<template>
  <div class="app">
    <template v-if="isLogin">
      <Sidebar @change="handleViewValueChange" />
      <Navbar />
    </template>
    <div class="app-view" :class="{ 'no-auth': !isLogin }">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.app-view {
  /* padding: 120px 20px 20px 170px; */
  padding: 120px 20px 20px 270px;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}
.app-view.no-auth {
  padding: 0;
  /* display: grid;
  align-items: center; */
}

/* focus-within effect */
.app:focus-within .navbar {
  border-color: #6C63FF;
  box-shadow: 15px 0 15px rgba(0, 0, 0, .1);
}
.app:focus-within .sidebar::before {
  border-color: #6C63FF;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, .05);
}
.app:focus-within .avatar {
  box-shadow: 0 0 10px #6C63FF;
}
</style>
