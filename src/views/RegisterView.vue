<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { guardar } from '@/stores/profile';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const toast = useToast();
    const router = useRouter();

    const handleRegister = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        // Save user profile data
        await guardar(user, { email: user.email });
        // Show success message
        toast.success('¡Registro exitoso!');
        // Redirect to home
        router.push('/');
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('Error en el registro: ' + error.message);
      }
    };

    return { email, password, handleRegister };
  }
};
</script>
