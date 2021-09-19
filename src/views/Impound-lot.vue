<template>
  <div class="about">
    <div class="container-button">
      <div style="display: block">
        <button v-on:click="openModal" type="button" class="btn btn-primary">Добавить машину
        </button>
      </div>
      <div style="display: block">
        <button v-on:click="exit" type="button" class="btn btn-danger">Выход
        </button>
      </div>
    </div>
    <add-car-form
      :formModal="formModal"
    />

    <delete-warning
      :warningModal="warningModal"
      :id="deletingId"
      :number="deletingNumber"
    />

    <table class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Гос номер</th>
        <th scope="col">Время</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(car, index) in this.cars" :key="index">
        <th scope="row">{{ car.id }}</th>
        <td>{{ car.number }}</td>
        <td>{{ car.date.toLocaleString() }}</td>
        <td>
          <button type="button" v-on:click="() => prepareForDelete(warningModal, car.id, car.number)" class="btn-close" aria-label="Delete"/>
        </td>
      </tr>
      </tbody>
    </table>
    <pagination :count="count" :current-page="currentPage" :load-next-purchase-page="loadNextPurchasePage"
                :load-prev-purchase-page="loadPrevPurchasePage"/>
  </div>
</template>
<style>
.about {
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

.container-button{
  justify-content: space-between;
  display: flex;
}
</style>
<script>
import { onMounted, provide, ref } from 'vue'
import AddCarForm from '../components/add-car-form'
import * as bootstrap from 'bootstrap'
import { useRouter } from 'vue-router'
import ApiService from '../services/api'
import { API_HOST } from '../constants'
import DeleteWarning from '../components/delete-warning'
import { JwtTokenWorker } from '../jwt-guard'
import Pagination from '../components/pagination'

export default {
  components: {
    Pagination,
    DeleteWarning,
    AddCarForm
  },
  data: function () {
    return {
      formModal: {},
      warningModal: {}
    }
  },
  mounted () {
    this.formModal = new bootstrap.Modal(document.getElementById('addCarModal'))
    this.warningModal = new bootstrap.Modal(document.getElementById('deleteWarning'))
  },
  methods: {
    openModal () {
      this.formModal.toggle()
    },
    exit () {
      const JWTGuard = new JwtTokenWorker()
      JWTGuard.clearTokens()
      this.$router.replace('/login')
    },
    async loadNextPurchasePage () {
      await this.nextPage()
    },
    async loadPrevPurchasePage () {
      await this.prevPage()
    }
  },
  setup () {
    const count = ref(0)
    const currentPage = ref(1)
    const cars = ref([])
    const router = useRouter()
    const deletingId = ref('')
    const deletingNumber = ref('')

    const prevPage = async () => {
      currentPage.value -= 1
      await loadImpoundLot()
    }

    const nextPage = async () => {
      currentPage.value += 1
      await loadImpoundLot()
    }

    const loadImpoundLot = async () => {
      const response = await ApiService.get(`${API_HOST}/impound-lot/?page=${currentPage.value}`, {}, router)
      console.log(response)
      if (response.results) {
        cars.value = response.results
        count.value = response.count
      }
    }

    onMounted(async () => {
      await loadImpoundLot()
    })

    const prepareForDelete = (warningModal, id, number) => {
      deletingId.value = id
      deletingNumber.value = number
      warningModal.toggle()
    }

    provide('loadImpoundLot', loadImpoundLot)

    return {
      cars,
      prepareForDelete,
      deletingId,
      deletingNumber,
      count,
      currentPage,
      loadImpoundLot,
      prevPage,
      nextPage
    }
  }
}
</script>
