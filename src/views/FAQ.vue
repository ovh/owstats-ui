<template>
  <div>
    <b-card
      v-for="(category, i) in categories"
      :key="`category-${i}`"
      class="card-margin"
    >
      <h2>
        {{ $t('faq.' + category) }}
      </h2>
      <div
        v-for="(item, j) in categoryItems(category)"
        :key="`item-${j}`"
      >
        <h3> {{ item.title }} </h3>
        <p> {{ item.value }} </p>
      </div>
    </b-card>
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
    }
  }
}
</script>
