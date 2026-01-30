import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Toastification
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 30,
  newestOnTop: true,
});
app.use(router);

app.mount("#app");
