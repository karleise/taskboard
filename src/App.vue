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
  <main>
    <div id="div_cuerpo">
      <router-link class="botones" to="/login" v-if="!usuariolog">Login</router-link>
      <router-link class="botones" to="/register" v-if="!usuariolog">Register</router-link>
      <router-link class="botones" to="/" v-if="usuariolog">Tasks</router-link>
      <router-link class="botones" to="/workspace" v-if="usuariolog">Work Space</router-link>
      <button class="boton2" v-if="usuariolog" @click="logout">Cerrar Sesión</button>
    </div>

    <div id="completo">
      <router-view></router-view>
    </div>
  </main>
</template>

