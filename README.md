### Tecnologías utilizadas

* **Vue 3 (Composition API):** Permite una arquitectura clara, moderna y fácil de mantener.
* **Firebase:** Gestión completa de autenticación de usuarios y base de datos en tiempo real.
* **Axios:** Utilizado para consumir la API externa de tareas.
* **Sass:** Organización eficiente de los estilos con mayor control y claridad.
* **Vercel:** Plataforma empleada para el despliegue de la aplicación.

---

### Estructura de Firestore

* **Colección `users`:** Almacena todos los usuarios registrados en la aplicación.
* Cada usuario cuenta con un **documento propio**, identificado por su UID de Firebase.
* Dentro de cada documento existe un **array `tasks`**, donde se guardan las tareas asociadas a ese usuario.

---

### Guía para ejecutar el proyecto en local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/andrees-code/workspace.git
   ```

2. **Instalar las dependencias:**

   ```bash
   npm install
   ```

3. **Crear un archivo `.env`** e incluir las credenciales de Firebase:

   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID
   ```

4. **Iniciar la aplicación en modo desarrollo:**

   ```bash
   npm run dev
   ```

---

### Deploy en Vercel

🔗 **Aplicación en producción:**
[https://taskboard-lovat-zeta.vercel.app/)

---

### Repositorio en GitHub

📦 **workspace**
Proyecto de prueba en el que las tareas se obtienen desde una API externa y se vinculan a usuarios mediante Firebase.
Repositorio: [https://github.com/andrees-code/workspace](https://github.com/andrees-code/workspace)
