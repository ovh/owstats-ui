<template>
  <!-- Main content -->
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
      <div class="animated fadeIn">
        <div class="tops">
          <b-card class="card-margin">
            <trend-widget
              id="trend200"
              :start-date="startDate"
              :end-date="endDate"
              :status-n1="statusN1"
              :status-n2="statusN2"
              base-title="status.codes_2xx"
              base-trend-type="text-success"
              :tooltip="$t('tooltips.top200')"
              :code-min="200"
              :code-max="300"
            />
          </b-card>
          <b-card class="card-margin">
            <trend-widget
              id="trend400"
              :start-date="startDate"
              :end-date="endDate"
              :status-n1="statusN1"
              :status-n2="statusN2"
              base-title="status.codes_4xx"
              base-trend-type="text-danger"
              :tooltip="$t('tooltips.top400')"
              :code-min="400"
              :code-max="500"
            />
          </b-card>
          <b-card class="card-margin">
            <trend-widget
              id="trend500"
              :start-date="startDate"
              :end-date="endDate"
              :status-n1="statusN1"
              :status-n2="statusN2"
              base-title="status.codes_5xx"
              base-trend-type="text-danger"
              :tooltip="$t('tooltips.top500')"
              :code-min="500"
              :code-max="1000"
            />
          </b-card>
        </div>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('status.errorhits') }}
              </h4>
              <basic-spline
                id="error-hits"
                :x-axis-data="errorChartXAxisData"
                :data="errorChartYAxisData"
                :nodata="$t('nodata')"
                :granularity="errorChartGranularity"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin fixed-min-size">
              <h4 class="oui-heading_4">
                {{ $t('status.topErrorPages') }}
              </h4>
              <plain-table
                id="top-error"
                :aggregated-data="topErrorAggregatedData"
                :table-columns="columnsTopError"
                :table-size="20"
              />
            </b-card>
          </b-col>
          <b-col>
            <b-card class="card-margin fixed-min-size">
              <h4 class="oui-heading_4">
                {{ $t('status.errorPie') }}
              </h4>
              <error-pie
                id="error-pie"
                :start-date="startDate"
                :end-date="endDate"
                :status-n1="statusN1"
              />
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
  </section>
  <!-- /.content -->
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import ErrorPie from '../components/dashboards/ErrorPie'
import TrendWidget from '../components/basicComponents/TrendWidget'
import PlainTable from '../components/basicComponents/PlainTable'
import BasicSplineChart from '../components/basicComponents/BasicSplineChart'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import moment from 'moment-timezone'
import utils from '../services/utils.js'

export default {
  name: 'Status',
  components: {
    DateTimePicker,
    DomainSelection,
    PlainTable,
    ErrorPie,
    TrendWidget,
    'basic-spline': BasicSplineChart,
    BRow,
    BCol,
    BCard
  },
  data () {
    return {
      isLoadingHour: true,
      isLoadingStatus: true,
      isLoadingStatuspage: true,
      errorChartXAxisData: [],
      errorChartYAxisData: [],
      errorChartGranularity: '',
      columnsTopError: [
        {
          key: 'id',
          label: 'status.id'
        },
        {
          key: 'request_origfilepath',
          label: 'status.status_pages'
        },
        {
          key: 'status_code',
          label: 'status.status_code'
        },
        {
          key: 'count',
          label: 'status.errorhits'
        },
        {
          key: 'ratio',
          label: 'status.ratio'
        }
      ]
    }
  },

  computed: {
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    },
    isLoading () {
      return [this.isLoadingHour, this.isLoadingStatus, this.isLoadingStatuspage].includes(true)
    },
    errorHits () {
      return this.$store.state.app.data.hourErrorhitsData
    },
    statuspagesErrorHits () {
      return this.$store.state.app.data.statuspagesErrorhitsData
    },
    hits () {
      return this.$store.state.app.data.hourHitsData
    },
    errorPages () {
      return this.$store.state.app.data.hourErrorpagesData
    },
    pages () {
      return this.$store.state.app.data.hourPagesData
    },
    statusN1 () {
      return this.$store.state.app.data.statusPagesData
    },
    statusN2 () {
      return this.$store.state.app.data.statusPagesPreviousData
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
    topErrorAggregatedData () {
      const rawData = this.$store.state.app.data.statuspagesErrorhitsData
      return utils.rawDataAggregation(rawData, this.columnsTopError)
    },
    chartsInputData () {
      return [
        {
          records: this.hits,
          type: 'hits',
          displayName: this.$t('status.hits')
        },
        {
          records: this.errorHits,
          type: 'errorhits',
          displayName: this.$t('status.errorhits')
        },
        {
          records: this.errorPages,
          type: 'errorpages',
          displayName: this.$t('status.errorPages')
        }
      ]
    }
  },
  watch: {
    isCdn () {
      if (!this.isCdn || this.$store.state.app.cdnDomains.includes(this.$store.state.app.domainSelected)) {
        this.fetchingStatusData()
        this.fetchingHourData()
        this.fetchingStatuspagesData()
      }
    },
    dateChanged () {
      this.fetchingStatusData()
      this.fetchingHourData()
      this.fetchingStatuspagesData()
    },
    domainChanged () {
      this.fetchingStatusData()
      this.fetchingHourData()
      this.fetchingStatuspagesData()
    },
    chartsInputData () {
      this.loadingErrorChart()
    }
  },
  mounted () {
    this.fetchingStatusData()
    this.fetchingHourData()
    this.fetchingStatuspagesData()
  },

  methods: {
    loadingErrorChart () {
      this.errorChartXAxisData = []
      this.errorChartYAxisData = []
      this.errorChartGranularity = ''
      this.chartsInputData.forEach(e => {
        const { chartData, axisData, granularity } = utils.computeSplineChartData(
          this.startDate,
          this.endDate,
          e.records
        )

        this.errorChartGranularity = granularity
        this.errorChartXAxisData = axisData

        this.errorChartYAxisData.push({
          name: e.displayName,
          data: chartData
        })
      })
    },

    fetchingHourData () {
      this.isLoadingHour = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'hour/errorhits',
          mutation: 'setHourErrorhitsData',
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
          endpoint: 'hour/hits',
          mutation: 'setHourHitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'hour/errorpages',
          mutation: 'setHourErrorpagesData',
          domainInParamaters: true,
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoadingHour = false
      })
    },

    fetchingStatusData () {
      this.isLoadingStatus = true

      const start = moment(this.startDate)
      const end = moment(this.endDate)
      const diff = end.diff(start, 'days')
      const prevEnd = start.subtract(1, 'days').format('YYYY-MM-DD')
      const prevStart = moment(prevEnd).subtract(diff, 'days').format('YYYY-MM-DD')

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'status/pages',
          mutation: 'setStatusPagesData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'status/pages',
          mutation: 'setStatusPagesPreviousData',
          startDate: prevStart,
          endDate: prevEnd,
          domainInParamaters: true,
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoadingStatus = false
      })
    },

    fetchingStatuspagesData () {
      this.isLoadingStatuspage = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'status_pages/errorhits',
          mutation: 'setStatuspagesErrorhitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoadingStatuspage = false
      })
    }
  }
}
</script>
