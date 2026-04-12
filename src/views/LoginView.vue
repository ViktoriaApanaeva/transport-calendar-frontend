<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Транспортные заявки</h2>
        <p>Вход в систему</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            type="email" 
            v-model="email" 
            class="form-control"
            placeholder="Email" 
            required
            autofocus
          >
        </div>
        
        <div class="form-group">
          <input 
            type="password" 
            v-model="password" 
            class="form-control"
            placeholder="Пароль" 
            required
          >
        </div>
        
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('/api/account/login', {
      email: email.value,
      password: password.value
    })
    
    if (response.data.success) {
      // Сохраняем данные пользователя
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Устанавливаем заголовок для всех будущих запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      // Перенаправляем на календарь
      router.push('/calendar')
    } else {
      error.value = response.data.message || 'Ошибка входа'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка подключения к серверу'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF3DB;
  font-family: 'Roboto', sans-serif;
}

.login-card {
  background: white;
  border-radius: 25px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: 2px solid #C09C6A;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #010047;
  font-weight: 600;
  margin-bottom: 10px;
}

.login-header p {
  color: #008EB9;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #C09C6A;
  border-radius: 15px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #008EB9;
  box-shadow: 0 0 0 3px rgba(0,142,185,0.2);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #008EB9;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: #006688;
  transform: translateY(-2px);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>