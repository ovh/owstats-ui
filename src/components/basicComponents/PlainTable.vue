<template>
  <simple-table
    :table="table"
    :columns="tableColumns"
  />
</template>

<script>
import SimpleTable from './BasicTable'
import utils from '../../services/utils.js'

export default {
  name: 'PlainTable',
  components: { SimpleTable },
  props: {
    aggregatedData: {
      type: Object,
      required: true
    },
    tableColumns: {
      type: Array,
      required: true
    },
    tableSize: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      default: 'DESC'
    },
    formatFunction: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      table: []
    }
  },
  mounted () {
    this.populateRecords()
  },
  methods: {
    populateRecords () {
      this.table = utils.computeTableAndChartData(
        this.aggregatedData, this.tableColumns, this.tableSize, false, null, this.sort, this.formatFunction
      )
    }
  }
}
</script>
