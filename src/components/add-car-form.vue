<template>
  <div class="modal fade" id="addCarModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Новая машина</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">Гос номер:</label>
              <input type="text" class="form-control" id="recipient-name" v-model="numberValue">
            </div>
            <div class="mb-3">
              <label class="col-form-label">Время:</label>
              <div class="input-group mb-3">
                <button class="btn btn-outline-secondary" v-on:click="nowDate" type="button" id="button-addon1">Сейчас</button>
                <input type="time" v-model="timeValue" class="form-control" placeholder="" aria-describedby="button-addon1">
                <input type="date" v-model="dateValue" class="form-control" placeholder="" aria-describedby="button-addon1">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" v-on:click="addNewCarCloseModal">Добавить</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref } from 'vue'
import { API_HOST } from '../constants'
import { useRouter } from 'vue-router'
import ApiService from '../services/api'

export default {
  name: 'add-car-form',
  props: {
    formModal: {
      type: Object
    }
  },
  setup () {
    const router = useRouter()
    const numberValue = ref('')
    const timeValue = ref('')
    const dateValue = ref('')

    const loadImpoundLot = inject('loadImpoundLot')

    const clearValues = () => {
      numberValue.value = ''
      timeValue.value = ''
      dateValue.value = ''
    }

    const nowDate = () => {
      const dateTime = new Date()
      const localStringDate = dateTime.toLocaleString().replace(', ', 'T')
      const localIsoString = dateTime.toISOString().split('T')[0]

      timeValue.value = `${localStringDate.split('T')[1].slice(0, 5)}`
      dateValue.value = `${localIsoString}`
    }

    const addNewCar = async () => {
      const date = `${dateValue.value} ${timeValue.value}`
      const number = numberValue.value.toUpperCase()
      await ApiService.post(`${API_HOST}/impound-lot/`, { date, number }, router)
      await loadImpoundLot()
    }

    return {
      numberValue,
      addNewCar,
      timeValue,
      dateValue,
      clearValues,
      nowDate
    }
  },

  methods: {
    async addNewCarCloseModal () {
      await this.addNewCar()
      this.clearValues()
      this.formModal.hide()
    }
  }
}
</script>
