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
      <b-row>
        <b-col class="col-lg-12 col-xl-12">
          <domain-info
            id="domain-info"
            :visits="visits"
            :valid-pages="domainValid"
            :error-pages="domainError"
            :session="session"
            :start-date="startDate"
            :end-date="endDate"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-sm-12">
          <b-card class="card-margin">
            <h4 class="oui-heading_4">
              {{ $t('dashboard.traffic') }}
            </h4>
            <basic-spline
              id="traffic"
              :x-axis-data="trafficXAxisData"
              :data="trafficYAxisData"
              :nodata="$t('nodata')"
              :granularity="trafficGranularity"
            />
          </b-card>
        </b-col>
      </b-row>
      <top-domains
        v-if="isTopDomainsDisplayed"
        id="top-domain"
        :error="domainError"
        :hits="domainValid"
        :start-date="startDate"
        :end-date="endDate"
      />
    </div>
  </section>
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import TopDomains from '../components/dashboards/TopDomains'
import DomainInfo from '../components/dashboards/DomainInfo'
import BasicSplineChart from '../components/basicComponents/BasicSplineChart'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import utils from '../services/utils.js'

export default {
  name: 'Dashboard',
  components: {
    DateTimePicker,
    DomainSelection,
    TopDomains,
    DomainInfo,
    'basic-spline': BasicSplineChart,
    BRow,
    BCol,
    BCard
  },
  data () {
    return {
      isLoadingHour: true,
      isLoadingDomain: true,
      trafficXAxisData: [],
      trafficYAxisData: [],
      trafficGranularity: ''
    }
  },
  computed: {
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    },
    isTopDomainsDisplayed () {
      return (this.$store.state.app.domainSelected === 'all' && this.$store.state.app.domains.length > 1)
    },
    isLoading () {
      return this.isLoadingHour | this.isLoadingDomain
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
    visits () {
      return this.$store.state.app.data.hourVisitsData
    },
    pages () {
      return this.$store.state.app.data.hourPagesData
    },
    session () {
      return this.$store.state.app.data.hourAvgsessiontimeData
    },
    domainValid () {
      return this.$store.state.app.data.domainValidpagesData
    },
    domainError () {
      return this.$store.state.app.data.domainErrorpagesData
    },

    dateChanged () {
      return this.$store.state.app.dateChanged
    },
    domainChanged () {
      return this.$store.state.app.domainChanged
    },
    chartsInputData () {
      return [
        {
          records: this.pages,
          type: 'pages',
          displayName: this.$t('dashboard.totalPages')
        },
        {
          records: this.visits,
          type: 'visits',
          displayName: this.$t('dashboard.visits')
        }
      ]
    }
  },
  watch: {
    dateChanged () {
      this.fetchingHourData()
      this.fetchingDomainData()
    },
    domainChanged () {
      this.fetchingHourData()
      this.fetchingDomainData()
    },
    chartsInputData () {
      this.loadingTraffic()
    }
  },
  mounted () {
    this.fetchingHourData()
    this.fetchingDomainData()
    console.log({ domainValid: this.domainValid, pages: this.pages })
  },
  methods: {
    loadingTraffic () {
      this.trafficXAxisData = []
      this.trafficYAxisData = []
      this.trafficGranularity = ''

      this.chartsInputData.forEach(e => {
        const { chartData, axisData, granularity } = utils.computeSplineChartData(
          this.startDate,
          this.endDate,
          e.records
        )

        this.trafficGranularity = granularity
        this.trafficXAxisData = axisData

        this.trafficYAxisData.push({
          name: e.displayName,
          data: chartData
        })
      })
    },
    fetchingDomainData () {
      this.isLoadingDomain = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'domains/validpages',
          mutation: 'setDomainValidpagesData',
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'domains/errorpages',
          mutation: 'setDomainErrorpagesData',
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoadingDomain = false
      })
    },

    fetchingHourData () {
      this.isLoadingHour = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'hour/visits',
          mutation: 'setHourVisitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'hour/pages',
          mutation: 'setHourPagesData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'hour/avgsessiontime',
          mutation: 'setHourAvgsessiontimeData',
          domainInParamaters: true,
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoadingHour = false
      })
    }
  }
}
</script>
