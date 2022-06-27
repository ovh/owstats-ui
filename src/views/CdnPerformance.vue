<template>
  <section class="content">
    <div class="filters">
      <date-time-picker />
      <domain-selection />
    </div>
    <div v-if="!isLoading">
      <div class="animated fadeIn">
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('cdn_performance.heatmap') }}
              </h4>
              <heat-map
                id="heat-map"
                :raw-data="responseTimeData"
                :map-columns="mapColumns"
                :map-title="$t('cdn_performance.heatmap')"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('cdn_performance.topRegions') }}
              </h4>
              <plain-table
                id="top-region"
                :aggregated-data="topRegionAggregatedData"
                :table-columns="columnsTopRegion"
                :table-size="20"
                sort="ASC"
              />
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
  </section>
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import HeatMap from '../components/dashboards/HeatMapCdnPerformance'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import PlainTable from '../components/basicComponents/PlainTable'
import utils from '../services/utils.js'

export default {
  name: 'CdnCache',
  components: {
    DateTimePicker,
    DomainSelection,
    HeatMap,
    PlainTable,
    BRow,
    BCol,
    BCard
  },
  data () {
    return {
      isLoading: true,
      mapColumns: [
        {
          key: 'id',
          label: 'cdn_performance.id'
        },
        {
          key: 'country',
          label: 'cdn_performance.country'
        },
        {
          key: 'count',
          label: 'cdn_performance.count'
        }
      ],
      columnsTopRegion: [
        {
          key: 'id',
          label: 'cdn_performance.id'
        },
        {
          key: 'country',
          label: 'cdn_performance.country'
        },
        {
          key: 'region',
          label: 'cdn_performance.region'
        },
        {
          key: 'count',
          label: 'cdn_performance.count'
        }
      ]
    }
  },
  computed: {
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    },
    startDate () {
      return this.$store.state.app.startDate
    },
    endDate () {
      if (this.$store.state.app.endDate) {
        return this.$store.state.app.endDate
      } else {
        return this.$store.state.app.startDate
      }
    },
    dateChanged () {
      return this.$store.state.app.dateChanged
    },
    domainChanged () {
      return this.$store.state.app.domainChanged
    },
    responseTimeData () {
      return this.$store.state.app.data.cdnResponseTimeData
    },
    topRegionAggregatedData () {
      const rawData = this.$store.state.app.data.cdnResponseTimeData
      return utils.rawDataAverageAggregation(rawData, this.columnsTopRegion)
    }
  },
  watch: {
    isCdn () {
      this.$router.replace({
        path: 'dashboard'
      })
    },
    dateChanged () {
      this.fetchPerformanceData()
    },
    domainChanged () {
      this.fetchPerformanceData()
    }
  },
  mounted () {
    this.fetchPerformanceData()
  },
  methods: {
    async fetchPerformanceData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/responsetime',
          mutation: 'setCdnResponseTimeData',
          domainInParamaters: true
        })
      ]).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
