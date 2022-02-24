<!--
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-22 16:45:59
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 16:29:33
-->
<template>
  <div class="navbar">
    <template v-if="account">
      <a href="" class="logout-btn" title="退出登录" @click.prevent="logout()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1H5zm13-6v-3h-7v-2h7V8l5 4-5 4z"/>
        </svg>
      </a>
      <span>{{ account }}</span>
    </template>
    <router-link v-else to="/login">登录</router-link>
    <Avatar v-show="account" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store'
import Avatar from '../Avatar/index.vue'
const store = useStore()
const account = computed(() => store.user.account)

const logout = () => {
  localStorage.removeItem('x-token')
  window.location.href = '/home.html'
}
</script>

<style lang="less" scoped>
.navbar {
  height: 60px;
  width: calc(100% - 150px);
  padding-right: 20px;
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid #d9d9d9;
  transition: border-color .3s, box-shadow .3s;
  overflow: hidden;
  .avatar {
    margin-left: 10px;
  }
  .logout-btn {
    margin-right: 6px;
  }
  .logout-btn svg {
    fill: #d9d9d9;
    transition: fill .3s;
  }
  .logout-btn:hover svg {
    fill: #6C63FF;
  }
}
</style>
