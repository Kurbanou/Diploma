<script setup>
import { ref, nextTick, computed } from 'vue'
import { formatDate } from '@/utils/dateFormatter'
import { useHistory } from '@/composables/useHistory'
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
    <div class="wrapper gramot">
      <div class="logo">
        <img v-if="currentPlace === 'first'" src="/images/1st.png" alt="1 место" />
        <img v-else-if="currentPlace === 'second'" src="/images/2st.png" alt="2 место" />
        <img v-else-if="currentPlace === 'third'" src="/images/3st.png" alt="3 место" />
      </div>
      <div id="section-to-print" class="container">
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
        <div class="footer">ЛЕСОРУБ {{ new Date().getFullYear() }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: url(/images/lesorub.png) no-repeat;
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
  margin: 300px 0 0 220px;
}

.gramot .atribut {
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  width: 100%;
  margin-top: 20px;
  position: absolute;
  bottom: 150px;
}

.gramot .logo {
  width: 240px;
  position: absolute;
  left: 100px;
  top: 78px;
  z-index: 1;
}

.gramot .logo img {
  display: block;
  width: 100%;
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
  font-size: 3em;
  color: #b46a21;
  text-align: center;
  width: 100%;
  /* max-width: 90%; */
  line-height: 1.2;
  margin: 30px 0;
}

.gramot .text {
  font-size: 18px;
  font-family: 'Lora', serif;
  font-style: italic;
  color: black;
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 800px;
}

.footer {
  font-family: 'Marck Script', cursive;
  font-family: 'Montserrat', sans-serif;
  color: #b46a21;
  font-size: 1.5em;
  position: absolute;
  bottom: 40px;
  font-weight: bold;
}

.gramot .prof {
  color: black;
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
  font-family: 'Marck Script', cursive;
  font-style: italic;

  color: black;
  text-align: center;
  width: 190px;
  border-bottom: 1px solid black;

  user-select: none;
}

.gramot .date::after,
.gramot .signature::after {
  font-family: 'Lora', serif;
  font-family: 'Marck Script', cursive;
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
