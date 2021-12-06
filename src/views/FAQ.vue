<template>
  <b-card class="card-margin">
    <FaqAccordion :items="myItems" />
  </b-card>
</template>

<script>
import FaqAccordion from '../components/dashboards/FaqAccordion'
import faqFR from '../i18n/faq_fr.json'
import faqEN from '../i18n/faq_en.json'

export default {
  name: 'FAQ',
  components: {
    FaqAccordion
  },
  data () {
    const userLanguage = (
      (navigator.languages && navigator.languages[0]) ||
          ''
    ).substr(0, 2)
    if (userLanguage === 'fr') {
      return { myItems: faqFR }
    }
    return { myItems: faqEN }
  }
}
</script>
