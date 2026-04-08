<!-- HistoryPanel.vue -->
<script setup>
import { useHistory } from '@/composables/useHistory'

const { history, removeFromHistory, clearHistory } = useHistory('certificate_text_history')

// Функция для удаления одной записи
const handleRemove = (id, text) => {
  // Можно добавить подтверждение
  if (confirm(`Удалить запись: "${text.slice(0, 50)}..."?`)) {
    removeFromHistory(id)
  }
}
</script>

<template>
  <el-card class="history-panel">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>📜 Варианты поздравлений ({{ history.length }})</span>
        <el-button v-if="history.length > 0" size="small" type="danger" @click="clearHistory">
          Очистить всё
        </el-button>
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
        <el-card shadow="hover">
          <div class="history-item">
            <div class="history-content">
              <p><strong>Текст:</strong> {{ item.text }}</p>
            </div>
            <div class="history-actions">
              <el-button
                type="danger"
                size="small"
                circle
                @click="handleRemove(item.id, item.text)"
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
.previous {
  color: #909399;
  font-style: italic;
  margin-top: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}
.empty {
  padding: 20px;
}
</style>
