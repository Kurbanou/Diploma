<!-- HistoryPanel.vue (альтернативная версия) -->
<script setup>
import { useHistory } from '@/composables/useHistory'
import { ref } from 'vue'

// const { history, removeFromHistory, clearHistory } = useHistory('certificate_text_history')
const { history, removeFromHistory } = useHistory('certificate_text_history')

// Для отслеживания какая карточка скопирована
const copiedId = ref(null)

const copyTextToClipboard = async (text, id) => {
  try {
    await navigator.clipboard.writeText(text)

    // Показываем индикатор на конкретной карточке
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 1500)
  } catch (err) {
    console.log(err)
    fallbackCopyText(text, id)
  }
}

const fallbackCopyText = (text, id) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)

  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 1500)
}

const handleRemove = (id, text, event) => {
  event.stopPropagation()
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
        <!-- <el-button v-if="history.length > 0" size="small" type="danger" @click="clearHistory">
          Очистить всё
        </el-button> -->
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
        <el-card
          shadow="hover"
          class="history-card"
          :class="{ 'card-copied': copiedId === item.id }"
          @click="copyTextToClipboard(item.text, item.id)"
        >
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

          <!-- Индикатор копирования -->
          <div v-if="copiedId === item.id" class="copy-indicator">✓ Скопировано!</div>
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

.card-copied {
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0) 100%);
}

.copy-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  /* transform: translate(-50%, -50%); */
  background: rgba(103, 194, 58, 0.95);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  animation: fadeInOut 1.5s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
