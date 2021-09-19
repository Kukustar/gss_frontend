<template>
  <div class="home">
    <h5>БЫСТРЫЙ ПОИСК АВТОМОБИЛЯ НА ШТРАФНОЙ СТОЯНКЕ В ЧЕРНЯХОВСКЕ</h5>
    <div class="input-group input-group-lg">
      <input v-model="carNumber" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      <button class="btn btn-outline-secondary" v-on:click="carSearch" type="button" id="button-addon1">Поиск</button>
    </div>
    <div style="margin-top: 25px">
      <founded-car-card
        v-if="foundedCar !== ''"
        :number="foundedCar.number"
        :time="foundedCar.date"
      />

    </div>
  </div>

</template>

<script>

import { API_HOST } from '../constants'
import FoundedCarCard from '../components/founded-car-card'

export default {
  name: 'Home',
  components: { FoundedCarCard },
  data () {
    return {
      carNumber: '',
      foundedCar: ''
    }
  },
  methods: {
    async carSearch () {
      const res = await fetch(`${API_HOST}/find-car/?number=${this.carNumber.toUpperCase()}`, {
        method: 'GET'
      })
      const data = await res.json()
      if (data.length > 0) {
        this.foundedCar = data[0]
      }
    }
  }
}
</script>
<style>
.home {
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
