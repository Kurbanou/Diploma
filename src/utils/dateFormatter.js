// Создайте файл utils/dateFormatter.js
export const formatDate = (dateString, addYearSuffix = false) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const formatted = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return addYearSuffix ? `${formatted}` : formatted
}
