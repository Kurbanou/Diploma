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
</script>
<template>
  <div class="certificate">
    <div class="wrapper gramot">
      <div class="logo">
        <app-logo />
      </div>
      <div id="section-to-print" class="container">
        <h1>БЛАГОДАРНОСТЬ</h1>
        <h2>Объявляется</h2>
        <!-- Профессия -->
        <div class="prof field" @dblclick="startEditing('profession')">
          <el-input
            v-if="editing.field === 'profession'"
            v-model="editValue"
            @blur="saveEdit"
            @keyup.enter="saveEdit"
            ref="inputRef"
            style="width: 800px"
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
            style="width: 800px"
          />
          <span v-else>{{ user.name }}</span>
        </div>

        <!-- Текст -->
        <div class="text field" @dblclick="startEditing('text')">
          <el-input
            style="width: 800px"
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
  background: url(/images/blagodarnost2.png) no-repeat;
  position: relative;
  background-size: cover;
  display: flex;
  justify-content: center;
  font-size: 18px;
}
.gramot .container {
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 80%;
  height: 80%;
}

.gramot :deep(.logoSt1),
.gramot :deep(.logoSnow) {
  fill: #b39566;
  /* fill: url(#goldGradient); */
}

.gramot :deep(.logoSt0) {
  fill: none;
  stroke: #b39566;
  /* stroke: url(#goldGradient); */
  stroke-width: 8;
  stroke-miterlimit: 10;
}

.gramot .logo {
  width: 100px;
  position: absolute;
  left: 40px;
  top: 40px;
  z-index: 1;
}

h1 {
  font-family: 'Lora', serif;
  font-size: 4em;
  line-height: 1;
  margin-top: 80px;
  font-weight: 500;
  color: var(--colorGreen);
}

h2 {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 2em;
  line-height: 1;
  margin-top: 20px;
  font-weight: 400;
  color: var(--colorGreen);
}

.gramot .atribut {
  display: flex;
  justify-content: space-between;
  max-width: 700px;
  width: 100%;
  margin-top: 20px;
  position: absolute;
  bottom: 200px;
  line-height: 1;
}

.gramot .name {
  font-family: 'Great Vibes', cursive;
  font-weight: 500;
  color: var(--colorName);
  text-align: center;
  line-height: 1.5;
  margin-top: 30px;
  border-bottom: 2px solid var(--colorName);

  /* Ключевые свойства */
  display: inline-block; /* Чтобы width: fit-content работал */
  width: fit-content; /* Подстраивается под контент */
  max-width: 100%; /* Но не шире родителя */
  padding-left: 30px;
  padding-right: 30px;
  white-space: nowrap; /* Запрещаем перенос */

  /* Хитрость: размер шрифта через vw относительно родителя */
  font-size: clamp(14pt, 8vw, 36pt);

  /* Центрирование блока */
  margin-left: auto;
  margin-right: auto;
}

.gramot .text {
  font-size: 1.2em;
  font-family: 'Lora', serif;
  font-style: italic;
  color: var(--colorBlack);
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  margin-top: 0.5em;
}

.gramot .prof {
  color: var(--colorBlack);
  font-size: 1.2em;
  font-weight: 400;
  font-family: 'Lora', serif;
  font-style: italic;
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
}

.gramot .date,
.gramot .signature {
  position: relative;
  font-family: 'Lora', serif;
  font-style: italic;
  color: var(--colorBlack);
  text-align: center;
  width: 250px;
  border-bottom: 1px solid var(--colorName);
  padding-bottom: 8px;
  user-select: none;
  font-size: 1.4em;
}

.gramot .date::after,
.gramot .signature::after {
  font-family: 'Lora', serif;
  color: var(--colorGrey);
  position: absolute;
  left: 50%;
  top: 36px;
  transform: translate(-50%, 0%);
  width: 100%;
  font-size: 0.7em;
}

.gramot .date::after {
  content: 'дата';
}

.gramot .signature::after {
  content: 'директор Скидельского лесхоза';
}
</style>
