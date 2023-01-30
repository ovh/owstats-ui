<template>
  <div>
    <b-row>
      <b-col md="8">
        <div :class="{ 'd-none': isLoading }">
          <heat-map
            :data="map_data"
            :name="mapTitle"
            :min="min"
            :max="max"
            :color="color"
          />
        </div>
      </b-col>
      <b-col md="4">
        <plain-table
          class="geoloc-visits"
          :aggregated-data="aggregatedData"
          :table-columns="mapColumns"
          :table-size="20"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BasicWorldMapChart from '../basicComponents/BasicWorldMapChart'
import PlainTable from '../../components/basicComponents/PlainTable'
import utils from '../../services/utils.js'
import variables from '../../assets/sass/_variables.scss'

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
    },
    color: {
      type: Array,
      default () { return [variables.p100, variables.p700] }
    }

  },

  data () {
    return {
      map_data: [],
      table: [],
      min: 0,
      max: 0,
      height: '600px',
      isLoading: false
    }
  },
  computed: {
    aggregatedData () {
      return utils.rawDataAggregation(this.rawData, this.mapColumns)
    }
  },
  mounted () {
    this.populateRecords(this.rawData)
  },
  methods: {
    populateRecords (records) {
      const type = utils.apiResponseDataType(records)
      const data = {}
      let mapMax = 0

      // Re-initialize this.data
      this.table = []
      this.map_data = []

      for (const key in records) {
        for (const d in records[key][type]) {
          const record = records[key][type][d]
          record.country = utils.dataValueReplacement('country', record)
          const val = parseInt(record.value)
          if (record.country in data) {
            data[record.country] += val
          } else {
            data[record.country] = val
          }
        }
      }

      // Convert to map object
      for (const key in data) {
        const name = key
        const val = data[key]

        this.map_data.push({
          name,
          value: val
        })
        if (val > mapMax) {
          mapMax = val
        }
      }
      this.max = mapMax
    }
  }
}
</script>

<style >
.geoloc-visits .b-table-sticky-header{
  max-height: 600px !important;
}
</style>
