<template>
  <div class="card">
    <div class="card-header">
      На штраф стоянке
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ number }}</h5>
      <p class="card-text">Эвакуирована {{ formattedDate }}</p>
      <p>Адрес: Пушкина 17а г Черняховск</p>
      <p>Телефон: 89062196168</p>
      <p>Время работы: каждый день с 08:00 до 20:00</p>
      <p>Организация: ООО Атлантика</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    number: String,
    time: String
  },
  computed: {
    formattedDate () {
      const dateTime = new Date(this.time)
      const time = `${dateTime.toISOString().split('T')[1].slice(0, 5)}`
      const date = `${dateTime.toISOString().split('T')[0]}`

      return `${date} в ${time}`
    }
  }

}
</script>
