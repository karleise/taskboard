<script setup>
  import { ref, onMounted } from 'vue';
  import { logOut } from '@/stores/auth';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const usuariolog = ref(false);
  const auth = getAuth();

  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      usuariolog.value = !!user
    })
    return unsubscribe
  })

  const logout = async () => {
    await logOut();
    router.push('/login');
  };
</script>

<template>
  <main class="app-container">
    <nav class="navbar">
      <div class="nav-brand">TaskBoard</div>
      <div class="nav-links">
        <router-link class="nav-link" to="/login" v-if="!usuariolog">Login</router-link>
        <router-link class="nav-link" to="/register" v-if="!usuariolog">Registro</router-link>
        <router-link class="nav-link" to="/" v-if="usuariolog">Tareas</router-link>
        <router-link class="nav-link" to="/workspace" v-if="usuariolog">Espacio de Trabajo</router-link>
        <button class="nav-logout" v-if="usuariolog" @click="logout">Cerrar Sesión</button>
      </div>
    </nav>

    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </main>
</template>

<style>
/* Estilos globales del App */
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f0 0%, #ffffff 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  background-color: #2c2c2c;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c9a876;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #c9a876;
  background-color: rgba(201, 168, 118, 0.1);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  width: 0;
  height: 2px;
  background-color: #c9a876;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: calc(100% - 2rem);
}

.nav-logout {
  background-color: #8b4513;
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-logout:hover {
  background-color: #a0522d;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  transform: translateY(-2px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1.5rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }

  .nav-link {
    display: block;
    text-align: center;
  }

  .content-wrapper {
    padding: 2rem 1rem;
  }
}
</style>
