<template>
  <div>
    <b-row>
      <b-col>
        <error-pie
          :labels="labels"
          :nodata="$t('nodata')"
          :data="data"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BasicPieChart from '../basicComponents/BasicPieChart'
import { BRow, BCol } from 'bootstrap-vue'

export default {
  name: 'ErrorPie',
  components: {
    'error-pie': BasicPieChart,
    BRow,
    BCol
  },
  props: {
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    statusN1: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      labels: [],
      data: []
    }
  },
  beforeMount () {
    this.loadingStatus()
  },
  methods: {
    loadingStatus () {
      if (Object.keys(this.statusN1).length === 0) {
        this.data = []
        this.labels = []
        return
      }

      const data = this.computeValue(this.statusN1)
      this.data = []
      this.labels = []
      for (const key in data) {
        this.data.push(data[key])
        this.labels.push((parseInt(key) * 100).toString())
      }
    },
    computeValue (records) {
      const val = { 2: 0, 3: 0, 4: 0, 5: 0 }

      /* Aggregate results */
      for (const key in records) {
        for (const d in records[key].pages) {
          const record = records[key].pages[d]
          val[record.status_code[0]] += parseInt(record.value)
        }
      }
      return val
    }
  }
}
</script>
