<template>
  <div class="workspace-container">
    <div class="workspace-header">
      <h1 class="workspace-title">Espacio de Trabajo</h1>
      <button class="btn-add-workspace">+ Nuevo Espacio</button>
    </div>

    <div class="workspace-grid">
      <div class="workspace-card-empty">
        <div class="card-icon">🏢</div>
        <p class="card-text">Sin espacios de trabajo</p>
        <p class="card-subtitle">Crea un nuevo espacio para colaborar con tu equipo</p>
      </div>
    </div>
  </div>
</template>

<style>
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

.btn-add-workspace {
  background: linear-gradient(135deg, #c9a876 0%, #a0826d 100%);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-add-workspace:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 168, 118, 0.3);
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.workspace-card-empty {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px dashed #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.workspace-card-empty:hover {
  border-color: #c9a876;
  box-shadow: 0 8px 20px rgba(201, 168, 118, 0.15);
  transform: translateY(-2px);
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

@media (max-width: 768px) {
  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace-title {
    font-size: 1.8rem;
  }

  .btn-add-workspace {
    width: 100%;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>
