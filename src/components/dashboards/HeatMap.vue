<template>
  <div>
    <b-row>
      <b-col md="8">
        <div :class="{ 'd-none': isLoading }">
          <heat-map
            :data="map_data"
            :name="name | translate"
            :min="min"
            :max="max"
          />
        </div>
      </b-col>
      <b-col md="4">
        <plain-table
          class="geoloc-visits"
          :aggregated-data="geolocVisitsAggregatedData"
          :table-columns="geolocVisitsColumns"
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
    }
  },

  data () {
    return {
      map_data: [],
      geolocVisitsTable: [],
      geolocVisitsColumns: [
        {
          key: 'id',
          label: 'geoloc.id'
        },
        {
          key: 'country',
          label: 'geoloc.country'
        },
        {
          key: 'count',
          label: 'geoloc.count'
        },
        {
          key: 'ratio',
          label: 'geoloc.ratio'
        }
      ],
      name: 'dashboard.visits',
      min: 0,
      max: 0,
      height: '600px',
      isLoading: false
    }
  },
  computed: {
    geolocVisitsAggregatedData () {
      return utils.rawDataAggregation(this.rawData, this.geolocVisitsColumns)
    }
  },
  mounted () {
    this.populateRecords(this.rawData, 'visits')
  },
  methods: {
    populateRecords (records, type) {
      const data = {}
      let mapMax = 0

      // Re-initialize this.data
      this.geolocVisitsTable = []
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
