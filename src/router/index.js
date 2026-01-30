import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import TasksView from "@/views/TasksView.vue";
import WorkspaceView from "@/views/WorkspaceView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useToast } from "vue-toastification";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: TasksView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/register",
      component: RegisterView,
    },
    {
      path: "/workspace",
      component: WorkspaceView,
      meta: { requiresAuth: true },
    },
  ],
});

const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });

router.beforeEach(async (to, from, next) => {
  const toast = useToast();
  const firebaseUser = await getCurrentUser();

  if (to.meta.requiresAuth && !firebaseUser) {
    toast.warning("¡Debes estar logueado!");
    next("/login");
    return;
  }

  if ((to.path === "/login" || to.path === "/register") && firebaseUser) {
    next("/");
    return;
  }

  next();
});

export default router;
