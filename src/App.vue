<template>
  <div id="app">
    <nav class="navbar-custom">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex gap-2">
          <router-link to="/calendar" class="nav-btn">Календарь</router-link>
          <router-link to="/about" class="nav-btn">О системе</router-link>
          <router-link to="/help" class="nav-btn">Помощь</router-link>
        </div>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

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
</style>