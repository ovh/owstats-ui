<template>
  <div>
    <div
      v-for="(category, i) in categories"
      :key="`category-${i}`"
    >
      <b-card
        v-if="isCategoryDisplayed(category)"
        class="card-margin"
      >
        <h2>
          {{ $t('faq.' + category) }}
        </h2>
        <div
          v-for="(item, j) in categoryItems(category)"
          :key="`item-${j}`"
        >
          <div v-if="isItemDisplayed(item)">
            <h3> {{ item.title }} </h3>
            <p> {{ item.value }} </p>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import faqFR from '../i18n/faq_fr.json'
import faqEN from '../i18n/faq_en.json'

export default {
  name: 'FAQ',
  data () {
    const userLanguage = (
      (navigator.languages && navigator.languages[0]) ||
          ''
    ).substr(0, 2)
    if (userLanguage === 'fr') {
      return { items: faqFR }
    }
    return { items: faqEN }
  },
  computed: {
    categories () {
      const uniqueCategories = this.items
        .map(item => item.category)
        .filter(
          (category, index, categories) =>
            categories.indexOf(category) === index
        )
      return uniqueCategories
    }
  },
  methods: {
    categoryItems (category) {
      return this.items.filter(item => item.category === category)
    },
    isCategoryDisplayed (category) {
      const isCategoryCdn = category.includes('cdn')
      const isCustomerCdn = this.$store.state.app.cdnDomains.length > 0

      if (isCategoryCdn && !isCustomerCdn) {
        return false
      }

      return true
    },
    isItemDisplayed (item) {
      const isCustomerCdn = this.$store.state.app.cdnDomains.length > 0

      if (item.cdnOnly && !isCustomerCdn) {
        return false
      }

      return true
    }
  }
}
</script>
