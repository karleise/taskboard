<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const toast = useToast();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        // Show success message
        toast.success('¡Sesión iniciada exitosamente!');
        // Redirect to home
        router.push('/');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Error en el inicio de sesión: ' + error.message);
      }
    };

    return { email, password, handleLogin };
  }
};
</script>
