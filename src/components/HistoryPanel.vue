<!-- HistoryPanel.vue (альтернативная версия) -->
<script setup>
import { useHistory } from '@/composables/useHistory'
import { ElMessageBox, ElMessage } from 'element-plus'

const { history, removeFromHistory } = useHistory('certificate_text_history')

const handleRemove = (id, text, event) => {
  event.stopPropagation()

  ElMessageBox.confirm(`Удалить запись: "${text.slice(0, 50)}..."?`, 'Подтверждение', {
    confirmButtonText: 'Удалить',
    cancelButtonText: 'Отмена',
    type: 'warning',
  })
    .then(() => {
      removeFromHistory(id)
      ElMessage.success('Запись удалена')
    })
    .catch(() => {
      // Пользователь отменил удаление
    })
}

const emits = defineEmits(['update:value'])
// Добавьте функцию-обработчик
const handleCardClick = (text) => {
  emits('update:value', text)
  ElMessage.success('Текст вставлен в форму')
}
</script>

<template>
  <el-card class="history-panel">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>📜 Варианты поздравлений ({{ history.length }})</span>
      </div>
    </template>

    <div v-if="history.length === 0" class="empty">
      <el-empty description="Нет сохранённых текстов" />
    </div>

    <el-timeline v-else>
      <el-timeline-item
        v-for="item in history"
        :key="item.id"
        :timestamp="new Date(item.timestamp).toLocaleString()"
        placement="top"
      >
        <el-card shadow="hover" class="history-card" @click="handleCardClick(item.text, item.id)">
          <div class="history-item">
            <div class="history-content">
              <p><strong>Текст:</strong> {{ item.text }}</p>
            </div>
            <div class="history-actions">
              <el-button
                type="danger"
                size="small"
                circle
                @click="(e) => handleRemove(item.id, item.text, e)"
              >
                ✕
              </el-button>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<style scoped>
.history-panel {
  position: absolute;
  z-index: 1;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;
  width: 95%;
}

.history-card {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.history-content {
  flex: 1;
}

.history-actions {
  flex-shrink: 0;
}

.empty {
  padding: 20px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>
