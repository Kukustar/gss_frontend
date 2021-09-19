<template>
  <div class="modal" id="deleteWarning">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Удалить машину</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Уверены что хотите удалить {{ number }} ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
          <button type="button" v-on:click="handleDelete" class="btn btn-danger">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'
import ApiService from '../services/api'
import { API_HOST } from '../constants'

export default {
  props: {
    id: Number,
    number: String,
    warningModal: Object
  },
  setup () {
    const loadImpoundLot = inject('loadImpoundLot')
    return {
      loadImpoundLot
    }
  },
  methods: {
    async handleDelete () {
      await ApiService.delete(`${API_HOST}/impound-lot/`, this.id, this.$router)
      this.loadImpoundLot()
      this.warningModal.hide()
    }
  }
}
</script>
