<script setup>
import { ref, nextTick, computed } from 'vue'
import { formatDate } from '@/utils/dateFormatter'
import { useHistory } from '@/composables/useHistory'
import AppPila from './icons/AppPila.vue'
import ru from 'element-plus/es/locale/lang/ru'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:user'])

// определить место

const placeVariants = {
  first: ['1 место', 'i место', 'первое место', '1-е место', 'Ⅰ место'],
  second: ['2 место', 'ii место', 'второе место', '2-е место', 'Ⅱ место'],
  third: ['3 место', 'iii место', 'третье место', '3-е место', 'Ⅲ место'],
}

// Определяем тип места по тексту
const placeType = (sometext) => {
  if (!sometext) return
  const normalized = sometext.toLowerCase().trim()
  for (const [place, variants] of Object.entries(placeVariants)) {
    if (variants.some((v) => normalized.includes(v.toLowerCase()))) {
      return place
    }
  }
  return null
}

// Текущее место (для отображения лого)
const currentPlace = computed(() => placeType(props.user.text))

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
    <div class="wrapperLetter gramot">
      <div class="logo">
        <img v-if="currentPlace === 'first'" src="/images/1st.png" alt="1 место" />
        <img v-else-if="currentPlace === 'second'" src="/images/2st.png" alt="2 место" />
        <img v-else-if="currentPlace === 'third'" src="/images/3st.png" alt="3 место" />
      </div>
      <div id="section-to-print" class="container">
        <h1>ДИПЛОМ</h1>
        <h2>Награждается</h2>
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
        <div class="footer">
          <app-pila />
          <div class="descr">ЛЕСОРУБ {{ new Date().getFullYear() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapperLetter {
  background: url(/images/lesorub.png) no-repeat;
  position: relative;
  background-size: cover;
  display: flex;
  justify-content: center;
  font-size: 16px;
}

.gramot .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5em;
}
h1 {
  font-family: 'Lora', serif;
  font-size: 4em;
  line-height: 1;
  margin-top: 200px;
  font-weight: 500;
  color: #342816;
}

h2 {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 1.6em;
  line-height: 1;
  margin-top: 20px;
  font-weight: 400;
  color: #342816;
}

.gramot .logo {
  width: 150px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 38px;
  z-index: 1;
}

.gramot .logo img {
  display: block;
  width: 100%;
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
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 1em;
  color: var(--colorBlack);
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 80%;
  margin-top: 20px;
}

.footer {
  position: relative;

  position: absolute;
  bottom: 50px;
  font-weight: bold;
  width: 150px;
}

.descr {
  position: absolute;
  top: 46px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Lora', serif;
  color: #a47237;
  font-size: 0.8em;
  font-weight: 800;
  line-height: 1;
  width: 400px;
  text-align: center;
}

.gramot .atribut {
  display: flex;
  justify-content: space-between;
  max-width: 600px;
  width: 100%;
  margin-top: 20px;
  position: absolute;
  bottom: 300px;
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
  font-size: 1.1em;
}

.gramot .date::after,
.gramot .signature::after {
  font-family: 'Lora', serif;
  color: var(--colorGrey);
  position: absolute;
  left: 50%;
  top: 50px;
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
