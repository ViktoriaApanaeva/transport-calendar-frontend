<template>
  <div id="app">
    <nav class="navbar-custom" v-if="isAuthenticated">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex gap-2">
          <router-link to="/calendar" class="nav-btn"> Календарь</router-link>
          <router-link to="/about" class="nav-btn"> О системе</router-link>
          <router-link to="/help" class="nav-btn"> Помощь</router-link>
        </div>
        
        <div class="d-flex gap-3 align-items-center">
          <span class="user-email">{{ userEmail }}</span>
          <button @click="handleLogout" class="logout-btn"> Выйти</button>
        </div>
      </div>
    </nav>
    
    <!-- Если не авторизован, показываем только router-view (страница входа) -->
    <router-view v-if="!isAuthenticated" />
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userEmail = computed(() => authStore.user?.email || '')

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
.navbar-custom {
  background-color: #008EB9;
  padding: 10px 0;
}

.nav-btn {
  background-color: #008EB9;
  color: white;
  padding: 8px 20px;
  border-radius: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: #006688;
  transform: translateY(-2px);
}

.router-link-active {
  background-color: #006688 !important;
  border: 2px solid #C09C6A !important;
}

.logout-btn {
  background-color: #C09C6A;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #a57e4a;
  transform: translateY(-2px);
}

.user-email {
  color: white;
  font-size: 14px;
  font-weight: 450;
}
</style>