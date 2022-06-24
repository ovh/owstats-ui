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
      <cdn-compression-widgets
        id="compression-widgets"
        :compression="compression"
      />
      <div class="animated fadeIn">
        <b-card class="card-margin">
          <h4 class="oui-heading_4">
            {{ $t('cdn_compression.chart') }}
          </h4>
          <basic-spline
            id="cdn_compression"
            :x-axis-data="chartXAxisData"
            :data="chartYAxisData"
            :nodata="$t('nodata')"
            :granularity="chartGranularity"
          />
        </b-card>
      </div>
    </div>
  </section>
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import BasicSplineChart from '../components/basicComponents/BasicSplineChart'
import CdnCompressionWidgets from '../components/dashboards/CdnCompressionWidgets.vue'
import utils from '../services/utils.js'

export default {
  name: 'CdnCache',
  components: {
    DateTimePicker,
    DomainSelection,
    CdnCompressionWidgets,
    'basic-spline': BasicSplineChart
  },
  data () {
    return {
      isLoading: true,
      chartXAxisData: [],
      chartYAxisData: [],
      chartGranularity: ''

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
    compression () {
      return this.$store.state.app.data.cdnCompressionData
    },
    chartsInputData () {
      return [
        {
          records: this.compression,
          displayName: this.$t('cdn_compression.chart_brotli'),
          filterParameter: { key: 'param', value: 'brotli' }
        },
        {
          records: this.compression,
          displayName: this.$t('cdn_compression.chart_gzip'),
          filterParameter: { key: 'param', value: 'gzip' }
        },
        {
          records: this.compression,
          displayName: this.$t('cdn_compression.chart_plain'),
          filterParameter: { key: 'param', value: 'plain' }
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
      this.fetchCompressionData()
    },
    domainChanged () {
      this.fetchCompressionData()
    },
    chartsInputData () {
      this.loadingChart()
    }
  },
  mounted () {
    this.fetchCompressionData()
  },
  methods: {
    loadingChart () {
      this.chartXAxisData = []
      this.chartYAxisData = []
      this.chartGranularity = ''
      this.chartsInputData.forEach(e => {
        const { chartData, axisData, granularity } = utils.computeSplineChartData(
          this.startDate,
          this.endDate,
          e.records,
          e.filterParameter
        )

        this.chartGranularity = granularity
        this.chartXAxisData = axisData

        this.chartYAxisData.push({
          name: e.displayName,
          data: chartData
        })
      })
    },

    async fetchCompressionData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/encoding',
          mutation: 'setCdnCompressionData',
          domainInParamaters: true
        })
      ]).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
