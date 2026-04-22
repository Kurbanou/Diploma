<script setup>
import { ref } from 'vue'
import AppGramota from './components/AppGramota.vue'
import AppGramotaPochetnaja from './components/AppGramotaPochetnaja.vue'
import AppLesovik from './components/AppLesovik.vue'
import AppBlagodarnost from './components/AppBlagodarnost.vue'
import AppLesorub from './components/AppLesorub.vue'

const value = ref('Option1')
const value5 = ref(false)
const options = [
  {
    value: 'Option1',
    label: 'грамота',
  },
  {
    value: 'Option2',
    label: 'почетная грамота',
  },

  {
    value: 'Option3',
    label: 'диплом юного лесовода',
  },
  {
    value: 'Option4',
    label: 'благодарность',
  },
  {
    value: 'Option5',
    label: 'лесоруб',
  },
]

const printCertificate = () => {
  window.print()
}

const user = ref({
  name: 'Иван Иванов Иванович',
  profession: 'должность',
  text: 'За добросовестный и многолетний труд в лесном хозяйстве, сохранение и приумножение лесных богатств, образцовое выполнение трудовых обязанностей',
  date: new Date().toISOString().split('T')[0],
})

const handleUserUpdate = (updatedUser) => {
  user.value = updatedUser
}

// Закрыть панель с задержкой
const closeHistoryPanel = () => {
  setTimeout(() => {
    value5.value = false
  }, 500)
}
</script>

<template>
  <div class="non-print">
    <el-row :gutter="20" justify="center">
      <div>
        <el-select v-model="value" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </div>
      <div>
        <el-switch
          v-model="value5"
          class="ml-2"
          width="80"
          inline-prompt
          active-text="pozdravok"
          inactive-text="pozdravok"
        />
      </div>
      <div><el-button type="primary" @click="printCertificate">Печать</el-button></div>
    </el-row>
    <div>
      <history-panel v-if="value5" @update:value="closeHistoryPanel" />
    </div>
  </div>
  <div class="inner">
    <app-gramota v-if="value === 'Option1'" :user="user" @update:user="handleUserUpdate" />

    <app-gramota-pochetnaja
      v-if="value === 'Option2'"
      :user="user"
      @update:user="handleUserUpdate"
    />

    <app-lesovik v-if="value === 'Option3'" :user="user" @update:user="handleUserUpdate" />

    <app-blagodarnost v-if="value === 'Option4'" :user="user" @update:user="handleUserUpdate" />

    <app-lesorub v-if="value === 'Option5'" :user="user" @update:user="handleUserUpdate" />
  </div>
</template>

<style>
:root {
  --colorDark: #a47237;
  --colorLite: #3a5c47;
}
.non-print {
  position: relative;
  padding: 30px 20px 0 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.non-print .el-row {
  width: 100%;
  max-width: 600px;
  display: flex;
  gap: 20px;
}
*,
::before,
::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.inner {
  width: 100%;
  max-width: 1240px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

body {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
}

.wrapper {
  width: 297mm;
  height: 210mm;
  page-break-after: always;
  transform: scale(clamp(0.3, 100vw / 1550px, 0.8));
  transform-origin: center top;
}

@media print {
  body {
    margin: 0;
  }
  .inner {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  .certificate {
    scale: 1;
  }
  .wrapper {
    width: 297mm;
    height: 210mm;
    page-break-after: always;
    transform: scale(1);
  }

  .container {
    padding: 0;
  }

  .non-print {
    display: none;
  }
}
</style>
