<template>
  <div>
    <b-row>
      <b-col>
        <basic-piechart
          :labels="chartLabels"
          :nodata="$t('nodata')"
          :chartname="$t(chartName)"
          :data="chartValues"
        />
      </b-col>
    </b-row>
    <simple-table
      :table="table"
      :columns="tableColumns"
    />
  </div>
</template>

<script>
import BasicPieChart from '../basicComponents/BasicPieChart'
import SimpleTable from './BasicTable'
import utils from '../../services/utils.js'
import { BRow, BCol } from 'bootstrap-vue'

export default {
  components: {
    'basic-piechart': BasicPieChart,
    'simple-table': SimpleTable,
    BRow,
    BCol
  },
  props: {
    aggregatedData: {
      type: Object,
      required: true
    },
    tableColumns: {
      type: Array,
      required: true
    },
    chartName: {
      type: String,
      required: true
    },
    chartSize: {
      type: Number,
      required: true
    },
    tableSize: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      chartValues: [],
      chartLabels: [],
      table: []
    }
  },
  beforeMount () {
    this.populateRecords()
  },
  methods: {
    populateRecords () {
      const { labels, values, tableData } = utils.computeTableAndChartData(
        this.aggregatedData,
        this.tableColumns,
        this.tableSize,
        true,
        this.chartSize
      )

      this.chartLabels = labels
      this.chartValues = values
      this.table = tableData
    }
  }
}
</script>
