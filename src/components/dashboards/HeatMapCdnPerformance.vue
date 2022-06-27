<template>
  <div>
    <b-row>
      <b-col md="8">
        <div :class="{ 'd-none': isLoading }">
          <heat-map
            :data="data.mapData"
            :name="mapTitle"
            :min="min"
            :max="data.mapMax"
          />
        </div>
      </b-col>
      <b-col md="4">
        <plain-table
          class="geoloc-visits"
          :aggregated-data="data.aggregatedData"
          :table-columns="mapColumns"
          :table-size="20"
          sort="ASC"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BasicWorldMapChart from '../basicComponents/BasicWorldMapChart'
import PlainTable from '../../components/basicComponents/PlainTable'
import utils from '../../services/utils.js'

export default {
  name: 'HeatMap',
  components: {
    'heat-map': BasicWorldMapChart,
    PlainTable
  },
  props: {
    rawData: {
      type: Object,
      required: true
    },
    mapColumns: {
      type: Array,
      required: true
    },
    mapTitle: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      min: 0,
      max: 0,
      height: '600px',
      isLoading: false
    }
  },
  computed: {
    data () {
      return this.populateRecords(this.rawData)
    }
  },

  mounted () {
    this.populateRecords(this.rawData)
  },
  methods: {
    populateRecords (records) {
      const type = utils.apiResponseDataType(records)
      const data = {}
      const aggregatedData = {
        aggregatedDataPerKey: {},
        keyColumnsDisplay: {},
        sumValues: 0
      }
      let mapMax = 0

      // Re-initialize this.data
      const mapData = []

      for (const key in records) {
        for (const d in records[key][type]) {
          const record = records[key][type][d]
          record.country = utils.dataValueReplacement('country', record)
          const value = parseInt(record.value)
          const hits = parseInt(record.hits)
          if (record.country in data) {
            data[record.country].value += value
            data[record.country].hits += hits
          } else {
            data[record.country] = {}
            data[record.country].value = value
            data[record.country].hits = hits
          }
        }
      }

      for (const country in data) {
        const responseTime = (data[country].value / data[country].hits).toFixed(2)
        mapData.push({
          name: country,
          value: responseTime
        })

        aggregatedData.aggregatedDataPerKey[country] = responseTime

        if (responseTime > mapMax) {
          mapMax = responseTime
        }
      }
      return { aggregatedData, mapMax, mapData }
    }
  }
}
</script>

<style >
.geoloc-visits .b-table-sticky-header{
  max-height: 600px !important;
}
</style>
