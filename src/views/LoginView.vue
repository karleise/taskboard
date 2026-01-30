<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Bienvenido</h1>
      <p class="login-subtitle">Inicia sesión en tu cuenta</p>

      <form @submit.prevent="handleLogin" class="login-form">
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
        </div>

        <button type="submit" class="submit-btn">Iniciar Sesión</button>
      </form>

      <p class="login-footer">
        ¿No tienes cuenta?
        <router-link to="/register" class="link">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  border-top: 4px solid #8b4513;
}

.login-title {
  color: #2c2c2c;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-weight: 700;
}

.login-subtitle {
  color: #666;
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
}

.login-form {
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
  border-color: #8b4513;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.submit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
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
  box-shadow: 0 8px 20px rgba(139, 69, 19, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.link {
  color: #8b4513;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #a0522d;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>

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
