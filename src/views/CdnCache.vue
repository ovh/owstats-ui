<template>
  <section class="content">
    <div class="filters">
      <date-time-picker />
      <domain-selection />
    </div>
    <div
      v-if="isLoading"
      class="loader"
    />
    <div v-if="!isLoading">
      <cdn-cache-widgets
        id="cache-widgets"
        :cache="cacheData"
        :bytes="bytesData"
      />
      <b-row>
        <b-col class="col-sm-12">
          <b-card class="card-margin">
            <h4 class="oui-heading_4">
              {{ $t('cdn_cache.cache_hit_miss') }}
            </h4>
            <basic-spline
              id="cache-spline"
              :x-axis-data="cacheXAxisData"
              :data="cacheYAxisData"
              :nodata="$t('nodata')"
              :granularity="cacheGranularity"
              :stacked="true"
            />
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-sm-12">
          <b-card class="card-margin">
            <h4 class="oui-heading_4">
              {{ `${$t('cdn_cache.bytes_hit_miss')} (${bytesUnit})` }}
            </h4>
            <basic-spline
              id="bytes-spline"
              :x-axis-data="bytesXAxisData"
              :data="bytesYAxisData"
              :nodata="$t('nodata')"
              :granularity="bytesGranularity"
              :stacked="true"
            />
          </b-card>
        </b-col>
      </b-row>
    </div>
  </section>
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import CdnCacheWidgets from '../components/dashboards/CdnCacheWidgets.vue'
import BasicSplineChart from '../components/basicComponents/BasicSplineChart'
import utils from '../services/utils.js'

export default {
  name: 'CdnCache',
  components: {
    DateTimePicker,
    DomainSelection,
    CdnCacheWidgets,
    'basic-spline': BasicSplineChart
  },
  data () {
    return {
      isLoading: true,
      cacheXAxisData: [],
      cacheYAxisData: [],
      cacheGranularity: '',
      bytesXAxisData: [],
      bytesYAxisData: [],
      bytesGranularity: '',
      bytesUnit: ''
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
    cacheData () {
      return this.$store.state.app.data.cdnCacheData
    },
    bytesData () {
      return this.$store.state.app.data.cdnBytesData
    },
    chartsInputDataCache () {
      return [
        {
          records: this.cacheData,
          filterParameter: { key: 'param', value: 'hits' },
          displayName: this.$t('cdn_cache.cache_hits')
        },
        {
          records: this.cacheData,
          filterParameter: { key: 'param', value: 'miss' },
          displayName: this.$t('cdn_cache.cache_miss')
        }
      ]
    },
    chartsInputDataBytes () {
      return [
        {
          records: this.bytesData,
          filterParameter: { key: 'param', value: 'hits' },
          displayName: this.$t('cdn_cache.bytes_hits')
        },
        {
          records: this.bytesData,
          filterParameter: { key: 'param', value: 'miss' },
          displayName: this.$t('cdn_cache.bytes_miss')
        }
      ]
    }
  },
  watch: {
    isCdn () {
      this.$router.replace({
        path: 'dashboard'
      })
    },
    dateChanged () {
      this.fetchCacheData()
    },
    domainChanged () {
      this.fetchCacheData()
    },
    chartsInputDataCache () {
      this.loadingCacheSpline()
    },
    chartsInputDataBytes () {
      this.loadingBytesSpline()
    }
  },
  mounted () {
    this.fetchCacheData()
  },
  methods: {
    loadingCacheSpline () {
      this.cacheXAxisData = []
      this.cacheYAxisData = []
      this.cacheGranularity = ''

      this.chartsInputDataCache.forEach(e => {
        const { chartData, axisData, granularity } = utils.computeSplineChartData(
          this.startDate,
          this.endDate,
          e.records,
          e.filterParameter
        )

        this.cacheGranularity = granularity
        this.cacheXAxisData = axisData

        this.cacheYAxisData.push({
          name: e.displayName,
          data: chartData
        })
      })
    },
    loadingBytesSpline () {
      this.bytesXAxisData = []
      this.bytesYAxisData = []
      this.bytesGranularity = ''
      this.bytesUnit = ''

      const rawBytesYAxisData = []
      this.chartsInputDataBytes.forEach(e => {
        const { chartData, axisData, granularity } = utils.computeSplineChartData(
          this.startDate,
          this.endDate,
          e.records,
          e.filterParameter
        )

        this.bytesGranularity = granularity
        this.bytesXAxisData = axisData

        rawBytesYAxisData.push({
          name: e.displayName,
          data: chartData
        })
      })

      // convert data volumes to the most readable human format
      const convertedBytesYAxisData = utils.convertArraysOfBytes(rawBytesYAxisData.map(e => e.data))
      this.bytesUnit = convertedBytesYAxisData.unit

      rawBytesYAxisData.forEach((element, index) => {
        this.bytesYAxisData.push({
          name: element.name,
          data: convertedBytesYAxisData.convertedValues[index]
        })
      })
    },
    async fetchCacheData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/cache',
          mutation: 'setCdnCacheData',
          domainInParamaters: true,
          isCdn: true
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/bytes',
          mutation: 'setCdnBytesData',
          domainInParamaters: true,
          isCdn: true
        })
      ]).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
