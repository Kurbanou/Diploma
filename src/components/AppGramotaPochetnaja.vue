<script setup>
import { ref, nextTick, computed } from 'vue'
import { formatDate } from '@/utils/dateFormatter'
import { useHistory } from '@/composables/useHistory'
import ru from 'element-plus/es/locale/lang/ru'
import AppLogo from './icons/AppLogo.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:user'])

// История изменений текста
const { history, addToHistory } = useHistory('certificate_text_history')

// Состояние редактирования
const editing = ref({ field: null })
const editValue = ref('')
const inputRef = ref(null)

// Начать редактирование
const startEditing = async (field) => {
  editing.value.field = field
  editValue.value = props.user[field]
  await nextTick()
  inputRef.value?.focus()
}

// Сохранить изменения
const saveEdit = () => {
  if (editing.value.field && editValue.value !== undefined) {
    const oldValue = props.user[editing.value.field]
    const newValue = editValue.value

    // Создаём обновлённый объект
    const updatedUser = {
      ...props.user,
      [editing.value.field]: editValue.value,
    }

    // Если изменилось поле 'text' — сохраняем в историю
    if (editing.value.field === 'text' && oldValue !== newValue) {
      addToHistory({
        text: newValue,
        previousText: oldValue,
        name: props.user.name,
        profession: props.user.profession,
      })
    }

    // Отправляем событие родителю
    emit('update:user', updatedUser)
  }
  editing.value.field = null
}

const formattedDate = computed(() => {
  return formatDate(props.user.date, true)
})

// Для отладки — можно посмотреть историю в консоли
console.log('История текстов:', history.value)
</script>
<template>
  <div class="certificate">
    <div class="wrapper gramot">
      <div class="logo">
        <app-logo />
      </div>
      <div id="section-to-print" class="container">
        <!-- Профессия -->
        <div class="prof field" @dblclick="startEditing('profession')">
          <el-input
            v-if="editing.field === 'profession'"
            v-model="editValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            ref="inputRef"
          />
          <span v-else>{{ user.profession }}</span>
        </div>

        <!-- Имя -->
        <div class="name field" @dblclick="startEditing('name')">
          <el-input
            v-if="editing.field === 'name'"
            v-model="editValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            ref="inputRef"
          />
          <span v-else>{{ user.name }}</span>
        </div>

        <!-- Текст -->
        <div class="text field" @dblclick="startEditing('text')">
          <el-input
            style="width: 600px"
            type="textarea"
            v-if="editing.field === 'text'"
            v-model="editValue"
            @blur="saveEdit"
            @keyup.ctrl.enter="saveEdit"
            ref="inputRef"
            :rows="4"
          ></el-input>
          <span v-else>{{ user.text }}</span>
        </div>

        <div class="atribut">
          <div class="date field" @dblclick="startEditing('date')">
            <!-- Оборачиваем DatePicker в ConfigProvider с русской локалью -->
            <el-config-provider v-if="editing.field === 'date'" :locale="ru">
              <el-date-picker
                v-model="editValue"
                type="date"
                placeholder="Выберите дату"
                format="DD.MM.YYYY"
                value-format="YYYY-MM-DD"
                @blur="saveEdit"
                @keyup.enter="saveEdit"
                ref="inputRef"
              />
            </el-config-provider>
            <!-- Отображаем отформатированную дату -->
            <span v-else>{{ formattedDate }}</span>
          </div>
          <div class="signature">А. Ч. Бумбуль</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: url(/images/gramota-pochetnaja.png) no-repeat;
  position: relative;
  background-size: cover;
  display: flex;
  justify-content: center;
}
.gramot .container {
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 600px;
  height: 80%;
  margin-top: 270px;
}

.gramot .atribut {
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  width: 100%;
  margin-top: 20px;
  position: absolute;
  bottom: 200px;
}
.gramot :deep(.logoSt1),
.gramot :deep(.logoSnow) {
  fill: #bb8c4b;
  /* fill: url(#goldGradient); */
}

.gramot :deep(.logoSt0) {
  fill: none;
  stroke: #bb8c4b;
  /* stroke: url(#goldGradient); */
  stroke-width: 8;
  stroke-miterlimit: 10;
  stroke-dasharray: 4240;
  animation: strok2 2s linear;
}

.gramot .logo {
  width: 140px;
  position: absolute;
  right: 90px;
  top: 100px;
  z-index: 1;
}

.gramot h1,
.gramot h2 {
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  text-align: center;
  user-select: none;
  line-height: 1;
}

.gramot .name {
  font-family: 'Marck Script', cursive;
  font-weight: 500;
  font-size: 60px;
  color: #bb8c4b;
  text-align: center;
  width: 100%;
  max-width: 90%;
  line-height: 1.2;
  margin: 30px 0;
}

.gramot .text {
  font-size: 18px;
  font-family: 'Lora', serif;
  font-style: italic;
  color: #49634a;
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 800px;
}

.gramot .prof {
  color: #49634a;
  font-size: 1em;
  font-weight: 400;
  font-family: 'Lora', serif;
  font-style: italic;
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 600px;
}

.gramot .date,
.gramot .signature {
  position: relative;
  font-family: 'Lora', serif;
  font-style: italic;

  color: #49634a;
  text-align: center;
  width: 190px;
  border-bottom: 1px solid #49634a;

  user-select: none;
}

.gramot .date::after,
.gramot .signature::after {
  font-family: 'Lora', serif;
  /* font-style: italic; */
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translate(-50%, 0%);
  width: 200%;
}

.gramot .date::after {
  content: 'дата';
}

.gramot .signature::after {
  content: 'директор Скидельского лесхоза';
}
</style>
