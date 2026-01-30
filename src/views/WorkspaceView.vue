<script setup>
import { onMounted, ref } from 'vue';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const loading = ref(false);
const error = ref('');
const tasks = ref([]);
const actionId = ref(null);

const fetchWorkspaceTasks = async () => {
  loading.value = true;
  error.value = '';

  try {
    const user = auth.currentUser;
    if (!user) {
      tasks.value = [];
      error.value = 'Inicia sesión para ver tu espacio de trabajo.';
      return;
    }

    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    tasks.value = Array.isArray(data.tasks) ? data.tasks : [];
  } catch (err) {
    error.value = 'No se pudieron cargar tus tareas.';
  } finally {
    loading.value = false;
  }
};

const persistTasks = async (updatedTasks) => {
  const user = auth.currentUser;
  if (!user) {
    error.value = 'Inicia sesión para gestionar tareas.';
    return;
  }

  await setDoc(
    doc(db, 'usuarios', user.uid),
    { tasks: updatedTasks },
    { merge: true }
  );
};

const removeTask = async (taskId) => {
  const updatedTasks = tasks.value.filter((task) => task.id !== taskId);
  actionId.value = taskId;

  try {
    await persistTasks(updatedTasks);
    await deleteDoc(doc(db, 'taskAssignments', String(taskId)));
    tasks.value = updatedTasks;
  } catch (err) {
    error.value = 'No se pudo eliminar la tarea.';
  } finally {
    actionId.value = null;
  }
};

const completeTask = async (taskId) => {
  const updatedTasks = tasks.value.map((task) =>
    task.id === taskId ? { ...task, completed: true } : task
  );
  actionId.value = taskId;

  try {
    await persistTasks(updatedTasks);
    await updateDoc(doc(db, 'taskAssignments', String(taskId)), {
      completed: true,
    });
    tasks.value = updatedTasks;
  } catch (err) {
    error.value = 'No se pudo completar la tarea.';
  } finally {
    actionId.value = null;
  }
};

onMounted(fetchWorkspaceTasks);
</script>

<template>
  <div class="workspace-container">
    <div class="workspace-header">
      <div>
        <h1 class="workspace-title">Espacio de Trabajo</h1>
        <p class="workspace-subtitle">Tus tareas asignadas activas</p>
      </div>
    </div>

    <div v-if="loading" class="workspace-status">
      <span class="status-dot"></span>
      Cargando tareas...
    </div>

    <div v-else-if="error" class="workspace-error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchWorkspaceTasks">Reintentar</button>
    </div>

    <div v-else-if="tasks.length === 0" class="workspace-empty">
      <div class="card-icon">🏢</div>
      <p class="card-text">Sin tareas asignadas</p>
      <p class="card-subtitle">Agrega tareas desde la vista principal</p>
    </div>

    <ul v-else class="workspace-list">
      <li v-for="task in tasks" :key="task.id" class="workspace-card">
        <div>
          <p class="workspace-task-title">{{ task.todo }}</p>
          <p class="workspace-task-meta">ID #{{ task.id }}</p>
        </div>

        <div class="workspace-actions">
          <span
            class="workspace-status-pill"
            :class="task.completed ? 'status-completed' : 'status-pending'"
          >
            {{ task.completed ? 'Completada' : 'Pendiente' }}
          </span>

          <button
            class="workspace-btn"
            :disabled="task.completed || actionId === task.id"
            @click="completeTask(task.id)"
          >
            {{ actionId === task.id ? 'Guardando...' : 'Marcar completada' }}
          </button>

          <button
            class="workspace-btn danger"
            :disabled="actionId === task.id"
            @click="removeTask(task.id)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.workspace-container {
  padding: 2rem 0;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.workspace-title {
  color: #2c2c2c;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}

.workspace-subtitle {
  margin: 0.5rem 0 0;
  color: #777;
  font-size: 0.95rem;
}

.workspace-status,
.workspace-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
  color: #4b4b4b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.workspace-error {
  flex-direction: column;
  align-items: flex-start;
  color: #8b4513;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #8b4513;
  animation: pulse 1.2s infinite ease-in-out;
}

.retry-btn {
  background-color: #2c2c2c;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #3b3b3b;
}

.workspace-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px dashed #e0e0e0;
  min-height: 300px;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.card-text {
  color: #2c2c2c;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.card-subtitle {
  color: #999;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

.workspace-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workspace-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.workspace-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.workspace-task-title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  color: #2c2c2c;
  font-weight: 600;
}

.workspace-task-meta {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.workspace-status-pill {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-pending {
  background: rgba(44, 44, 44, 0.08);
  color: #2c2c2c;
}

.status-completed {
  background: rgba(201, 168, 118, 0.15);
  color: #8b5e3c;
}

.workspace-btn {
  background: #2c2c2c;
  color: #fff;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.workspace-btn:hover {
  background-color: #3b3b3b;
  transform: translateY(-1px);
}

.workspace-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.workspace-btn.danger {
  background: #8b4513;
}

.workspace-btn.danger:hover {
  background: #a0522d;
}

@media (max-width: 768px) {
  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace-title {
    font-size: 1.8rem;
  }

  .workspace-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace-actions {
    width: 100%;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}
</style>
