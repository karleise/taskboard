import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase/config";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const currentUser = computed(() => user.value);

  // Actions
  const init = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  };

  const login = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      const credenciales = await signInWithEmailAndPassword(auth, email, password);
      return {
        ok: true,
        user: credenciales,
      };
    } catch (err) {
      console.error(err);
      error.value = err.message;
      return {
        ok: false,
        error: err.message,
      };
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      const credenciales = await createUserWithEmailAndPassword(auth, email, password);
      return {
        ok: true,
        user: credenciales,
      };
    } catch (err) {
      console.error(err);
      error.value = err.message;
      return {
        ok: false,
        error: err.message,
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      error.value = null;
      await signOut(auth);
      user.value = null;
      return {
        ok: true,
      };
    } catch (err) {
      console.error(err);
      error.value = err.message;
      return {
        ok: false,
        error: err.message,
      };
    } finally {
      loading.value = false;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (user.value?.emailVerified) {
        return {
          mensaje: "Usuario ya verificado",
          ok: true,
        };
      }
      await sendEmailVerification(user.value);
      return {
        mensaje: "Email enviado",
        ok: true,
      };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        error: err.message,
      };
    }
  };

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    init,
    login,
    register,
    logout,
    sendVerificationEmail,
  };
});
