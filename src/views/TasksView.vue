<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { arrayUnion, collection, doc, getDocs, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const tasks = ref([]);
const loading = ref(false);
const error = ref('');
const filter = ref('all');
const assignedBy = ref({});
const assigningId = ref(null);

const loadTasks = async () => {
  const { data } = await axios.get('https://dummyjson.com/todos');
  tasks.value = Array.isArray(data?.todos) ? data.todos : [];
};

const loadAssignments = async () => {
  const snapshot = await getDocs(collection(db, 'taskAssignments'));
  const assignedMap = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const taskId = data?.taskId ?? docSnap.id;

    if (taskId !== undefined && taskId !== null) {
      assignedMap[Number(taskId)] = data?.uid;
    }
  });

  assignedBy.value = assignedMap;
};

const fetchAll = async () => {
  loading.value = true;
  error.value = '';

  try {
    await Promise.all([loadTasks(), loadAssignments()]);
  } catch (err) {
    error.value = 'No se pudieron cargar las tareas. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

const filteredTasks = computed(() => {
  if (filter.value === 'completed') {
    return tasks.value.filter((task) => task.completed === true);
  }

  if (filter.value === 'pending') {
    return tasks.value.filter((task) => task.completed === false);
  }

  if (filter.value === 'assigned') {
    return tasks.value.filter((task) => Boolean(assignedBy.value[task.id]));
  }

  return tasks.value;
});

const assignmentLabel = (task) => {
  const assignedUid = assignedBy.value[task.id];

  if (!assignedUid) {
    return 'Sin asignar';
  }

  if (assignedUid === auth.currentUser?.uid) {
    return 'En tu workspace';
  }

  return 'Asignada';
};

const canAssign = (task) => {
  if (task.completed) {
    return false;
  }

  const assignedUid = assignedBy.value[task.id];
  return !assignedUid;
};

const addTaskToWorkspace = async (task) => {
  if (task.completed) {
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    error.value = 'Debes iniciar sesión para asignar tareas.';
    return;
  }

  const assignedUid = assignedBy.value[task.id];
  if (assignedUid && assignedUid !== user.uid) {
    return;
  }

  assigningId.value = task.id;

  try {
    const assignmentRef = doc(db, 'taskAssignments', String(task.id));
    const userRef = doc(db, 'usuarios', user.uid);

    await runTransaction(db, async (transaction) => {
      const assignmentSnap = await transaction.get(assignmentRef);
      if (assignmentSnap.exists()) {
        throw new Error('assigned');
      }

      transaction.set(assignmentRef, {
        taskId: task.id,
        uid: user.uid,
        todo: task.todo,
        completed: task.completed,
      });

      transaction.set(
        userRef,
        {
          tasks: arrayUnion({
            id: task.id,
            todo: task.todo,
            completed: task.completed,
          }),
        },
        { merge: true }
      );
    });

    await loadAssignments();
  } catch (err) {
    if (err?.message === 'assigned') {
      error.value = 'La tarea ya fue asignada a otro usuario.';
      await loadAssignments();
    } else {
      error.value = 'No se pudo asignar la tarea. Intenta de nuevo.';
    }
  } finally {
    assigningId.value = null;
  }
};

onMounted(fetchAll);
</script>

<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <div>
        <h1 class="tasks-title">Mis Tareas</h1>
        <p class="tasks-subtitle">Gestiona tu lista de tareas en un solo lugar</p>
      </div>

      <div class="tasks-actions">
        <label for="task-filter" class="filter-label">Filtrar</label>
        <select id="task-filter" v-model="filter" class="filter-select">
          <option value="all">Todas</option>
          <option value="completed">Finalizadas</option>
          <option value="pending">No finalizadas</option>
          <option value="assigned">Asignadas a un usuario</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="tasks-status">
      <span class="status-dot"></span>
      Cargando tareas...
    </div>

    <div v-else-if="error" class="tasks-error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchAll">Reintentar</button>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="tasks-empty">
      <div class="empty-icon">📋</div>
      <p class="empty-text">No hay tareas para mostrar</p>
      <p class="empty-subtitle">Prueba con otro filtro o vuelve más tarde</p>
    </div>

    <ul v-else class="tasks-list">
      <li v-for="task in filteredTasks" :key="task.id" class="task-card">
        <div>
          <p class="task-title">{{ task.todo }}</p>
          <p class="task-meta">{{ assignmentLabel(task) }}</p>
        </div>

        <div class="task-actions">
          <span
            class="task-status"
            :class="task.completed ? 'status-completed' : 'status-pending'"
          >
            {{ task.completed ? 'Completada' : 'Pendiente' }}
          </span>

          <button
            v-if="canAssign(task)"
            class="task-assign"
            :disabled="assigningId === task.id"
            @click="addTaskToWorkspace(task)"
          >
            {{ assigningId === task.id ? 'Agregando...' : 'Agregar' }}
          </button>

          <span
            v-else-if="!task.completed && assignedBy[task.id] === auth.currentUser?.uid"
            class="task-assigned"
          >
            En tu workspace
          </span>

          <span v-else-if="!task.completed" class="task-assigned">
            Asignada
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tasks-container {
  padding: 2rem 0;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.tasks-title {
  color: #2c2c2c;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}

.tasks-subtitle {
  margin: 0.5rem 0 0;
  color: #777;
  font-size: 0.95rem;
}

.tasks-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 220px;
}

.filter-label {
  font-size: 0.85rem;
  color: #555;
  font-weight: 600;
}

.filter-select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background-color: #fff;
  font-size: 0.95rem;
  color: #2c2c2c;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #8b4513;
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.tasks-status,
.tasks-error {
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

.tasks-error {
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

.tasks-empty {
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
  min-height: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-text {
  color: #2c2c2c;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.empty-subtitle {
  color: #999;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
}

.tasks-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.task-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  min-height: 180px;
}

.task-title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  color: #2c2c2c;
  font-weight: 600;
}

.task-meta {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.task-status {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.task-assign {
  background: #2c2c2c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.task-assign:hover {
  background-color: #3b3b3b;
  transform: translateY(-1px);
}

.task-assign:disabled {
  cursor: wait;
  opacity: 0.7;
  transform: none;
}

.task-assigned {
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b5e3c;
  background: rgba(201, 168, 118, 0.15);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.status-completed {
  background: rgba(201, 168, 118, 0.15);
  color: #8b5e3c;
}

.status-pending {
  background: rgba(44, 44, 44, 0.08);
  color: #2c2c2c;
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tasks-title {
    font-size: 1.8rem;
  }

  .tasks-actions {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .tasks-empty {
    min-height: 300px;
  }

  .tasks-list {
    grid-template-columns: 1fr;
  }

  .task-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
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
