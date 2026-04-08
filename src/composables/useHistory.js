// composables/useHistory.js
import { ref, watch } from 'vue'

export function useHistory(key) {
  // Загружаем историю из localStorage
  const history = ref(JSON.parse(localStorage.getItem(key)) || [])

  // Добавляем новую запись в историю
  const addToHistory = (item) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...item,
    }
    history.value.unshift(newEntry) // новые записи в начало
  }

  // Удалить одну запись по id
  const removeFromHistory = (id) => {
    history.value = history.value.filter((item) => item.id !== id)
  }

  // Очистить всю историю
  const clearHistory = () => {
    history.value = []
  }

  // Автосохранение в localStorage
  watch(
    history,
    () => {
      localStorage.setItem(key, JSON.stringify(history.value))
    },
    { deep: true },
  )

  return { history, addToHistory, removeFromHistory, clearHistory }
}
