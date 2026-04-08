<script setup>
import { ref, nextTick, computed } from 'vue'
import { formatDate } from '@/utils/dateFormatter'
import ru from 'element-plus/es/locale/lang/ru'
import 'dayjs/locale/ru'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:user'])

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
    // Создаём обновлённый объект
    const updatedUser = {
      ...props.user,
      [editing.value.field]: editValue.value,
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
    <div class="wrapper lesovychok">
      <!-- <div class="logo"><app-logo /></div> -->
      <div id="section-to-print" class="container">
        <div class="content">
          <p>Настоящим дипломом удостоверяется, <br />что _____________________________________</p>

          <p>
            вступил(а) в ряды дошкольного лесничества <b>«Юные лесоводы»</b>
            и торжественно
          </p>
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
          <div class="signature"><div class="name">А. Ч. Бумбуль</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: url(/public/images/lesovik.png) no-repeat;
  position: relative;
  background-size: cover;
  display: flex;
  justify-content: center;
}

.lesovychok :deep(.logoSt1),
.lesovychok .logoSnow {
  fill: #49322c;
}

.lesovychok :deep(.logoSt0) {
  fill: none;
  stroke: #49322c;
  stroke-width: 5;
  stroke-miterlimit: 10;
  stroke-dasharray: 4240;
  animation: strok2 2s linear;
}

.lesovychok .logo {
  width: 180px;
  position: absolute;
  left: 126px;
  top: 42px;
  z-index: 1;
}

.lesovychok .name2 {
  margin: 20px auto;
  font-size: 13px;
  opacity: 0.5;
}

.lesovychok p {
  text-align: center;
  font-size: 18px;
  font-family: 'Caveat', cursive;
  font-family: 'Comfortaa', sans-serif;
  line-height: 1.8em;
  color: #543c0d;
  font-weight: 800;
}

.lesovychok .name {
  font-family: 'Caveat', cursive;
  font-weight: 500;
  font-size: 48px;
  color: #000;
  text-align: center;
}

.lesovychok .text {
  font-size: 18px;
  font-family: 'Lora', serif;
  font-style: italic;
  color: #4f4c40;
  text-align: center;
  line-height: 1.5em;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
}

.lesovychok .atribut {
  display: flex;
  justify-content: space-between;
  max-width: 460px;
  width: 100%;
  align-items: flex-end;
  position: absolute;
  left: 51%;
  bottom: 115px;
  transform: translateX(-50%);
}

.lesovychok .date,
.lesovychok .signature {
  position: relative;
  font-family: 'Marck Script', cursive;
  font-style: italic;
  font-size: 20px;
  font-weight: 100;
  color: #4f4c40;
  text-align: center;
  width: 190px;
  user-select: none;
}

.lesovychok b {
  font-family: 'Yanone Kaffeesatz', sans-serif;
  font-size: 28px;
  line-height: 1;
  color: #db5f0d;
}

.lesovychok .signature .name {
  font-size: 20px;
  margin-top: 0;
}

.lesovychok .date::after,
.lesovychok .signature::after {
  font-family: 'Marck Script', cursive;
  font-style: italic;
  font-weight: 100;
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translate(-50%, 0%);
  width: 200%;
}

.lesovychok .date::after {
  content: 'дата';
}

.lesovychok .signature::after {
  content: 'директор Скидельского лесхоза';
}

.content {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 250px;
  width: 100%;
  text-align: center;
}
</style>
