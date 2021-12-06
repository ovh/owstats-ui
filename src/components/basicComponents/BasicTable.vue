<template>
  <b-row>
    <b-col>
      <b-table
        :items="tableTranslated"
        :fields="columns"
        sticky-header
        striped
        hover
        small
        show-empty
        :empty-text="$t('nodata')"
      >
        <template v-slot:head()="data">
          <span>{{ $t(data.label) }}</span>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BTable } from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BTable
  },
  props: {
    table: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  computed: {
    tableTranslated () {
      try {
        const newTable = JSON.parse(JSON.stringify(this.table))

        for (const i in newTable) {
          const row = newTable[i]

          for (const property in row) {
            if (['(no data)', 'Unknown'].includes(row[property])) {
              row[property] = this.$t('unknown')
            }

            if (property === 'country') {
              const country = row.country
              const code = 'countries.' + country
              const translation = this.$t(code)
              const isValidTranslation = translation !== code

              if (isValidTranslation) {
                row.country = translation
              }
            }
          }
        }
        return newTable
      } catch (e) {
        console.log(e)
        return this.table
      }
    }
  }
}
</script>
