<template>
  <section class="content">
    <div class="filters">
      <date-time-picker />
      <domain-selection />
    </div>
    <div v-if="!isLoading">
      <cdn-security-widgets
        id="security-widgets"
        :waf="waf"
        :https-redirect="httpsRedirect"
      />
      <div class="animated fadeIn">
        <b-card class="card-margin">
          <h4 class="oui-heading_4">
            {{ $t('cdn_security.chart') }}
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
import CdnSecurityWidgets from '../components/dashboards/CdnSecurityWidgets.vue'
import utils from '../services/utils.js'

export default {
  name: 'CdnCache',
  components: {
    DateTimePicker,
    DomainSelection,
    CdnSecurityWidgets,
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
    waf () {
      return this.$store.state.app.data.cdnWafData
    },
    httpsRedirect () {
      return this.$store.state.app.data.cdnHttpsRedirectData
    },
    chartsInputData () {
      return [
        {
          records: this.waf,
          displayName: this.$t('cdn_security.request_blocked'),
          filterParameter: { key: 'param', value: 'request_blocked' }
        },
        {
          records: this.waf,
          displayName: this.$t('cdn_security.response_blocked'),
          filterParameter: { key: 'param', value: 'response_blocked' }
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
      this.fetchSecurityData()
    },
    domainChanged () {
      this.fetchSecurityData()
    },
    chartsInputData () {
      this.loadingChart()
    }
  },
  mounted () {
    this.fetchSecurityData()
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
    async fetchSecurityData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/waf',
          mutation: 'setCdnWafData',
          domainInParamaters: true,
          isCdn: true
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/https_redirect',
          mutation: 'setCdnHttpsRedirectData',
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
