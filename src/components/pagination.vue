<template>
  <div class="pagination-container">
    <div class="pagination-button-wrapper">
      <nav aria-label="...">
        <ul class="pagination">
          <li class="page-item"  :class="{disabled: !isCanViewPrevButton}" >
            <button @click="loadPrevPurchasePage" class="page-link">Назад</button>
          </li>

          <li class="page-item" aria-current="page">
            <div class="page-link" >{{ currentPage }}</div>
          </li>
          <li class="page-item" :class="{disabled: !isCanViewNextButton}">
            <button @click="loadNextPurchasePage" class="page-link">Вперед</button>
          </li>
        </ul>
      </nav>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    loadNextPurchasePage: {
      type: Function,
      required: true
    },
    loadPrevPurchasePage: {
      type: Function,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  computed: {
    isCanViewNextButton () {
      return this.count - this.currentPage * 25 > 0
    },
    isCanViewPrevButton () {
      return this.currentPage > 1
    }
  }
}
</script>
