<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Crear Cuenta</h1>
      <p class="register-subtitle">Únete a nuestro espacio de trabajo</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="tu@email.com"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="••••••••"
            required
            class="form-input"
          />
          <p class="password-hint">Mínimo 6 caracteres</p>
        </div>

        <button type="submit" class="submit-btn">Registrarse</button>
      </form>

      <p class="register-footer">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="link">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<style>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem 1rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  border-top: 4px solid #c9a876;
}

.register-title {
  color: #2c2c2c;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-weight: 700;
}

.register-subtitle {
  color: #666;
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #2c2c2c;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.9rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c2c2c;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #c9a876;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(201, 168, 118, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.password-hint {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.submit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #c9a876 0%, #a0826d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 168, 118, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.link {
  color: #c9a876;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #8b6f47;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 2rem 1.5rem;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>

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
