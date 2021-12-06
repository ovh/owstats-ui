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
      <div class="animated fadeIn">
        <b-row>
          <b-col md="6">
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('browser.topBrowser') }}
              </h4>
              <chart-and-table
                id="top-browser"
                :table-columns="columnsTopBrowser"
                chart-name="browser.topBrowser"
                :table-size="3"
                :chart-size="3"
                :aggregated-data="topBrowserAggregatedData"
              />
            </b-card>
          </b-col>
          <b-col md="6">
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('browser.topPlatform') }}
              </h4>
              <chart-and-table
                id="top-platform"
                :table-columns="columnsTopPlatform"
                chart-name="browser.topPlatform"
                :table-size="3"
                :chart-size="3"
                :aggregated-data="topPlatformAggregatedData"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('browser.topBrowserDetails') }}
              </h4>
              <plain-table
                id="top-browser-details"
                :aggregated-data="topBrowserDetailsAggregatedData"
                :table-columns="columnsTopBrowserDetails"
                :table-size="20"
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
import PlainTable from '../components/basicComponents/PlainTable'
import ChartAndTable from '../components/basicComponents/ChartAndTable'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import utils from '../services/utils.js'

export default {
  name: 'Browser',
  components: {
    DateTimePicker,
    DomainSelection,
    PlainTable,
    ChartAndTable,
    BRow,
    BCol,
    BCard
  },
  data () {
    return {
      isLoading: true,
      columnsTopBrowser: [
        {
          key: 'id',
          label: 'browser.id'
        },
        {
          key: 'browser',
          label: 'browser.browser'
        },
        {
          key: 'count',
          label: 'browser.count'
        },
        {
          key: 'ratio',
          label: 'browser.ratio'
        }
      ],
      columnsTopPlatform: [
        {
          key: 'id',
          label: 'browser.id'
        },
        {
          key: 'platform',
          label: 'browser.platform'
        },
        {
          key: 'count',
          label: 'browser.count'
        },
        {
          key: 'ratio',
          label: 'browser.ratio'
        }
      ],
      columnsTopBrowserDetails: [
        {
          key: 'id',
          label: 'browser.id'
        },
        {
          key: 'platform',
          label: 'browser.platform'
        },
        {
          key: 'browser',
          label: 'browser.browser'
        },
        {
          key: 'browser_version',
          label: 'browser.browser_version'
        },
        {
          key: 'count',
          label: 'browser.count'
        },
        {
          key: 'ratio',
          label: 'browser.ratio'
        }
      ]
    }
  },
  computed: {
    dateChanged () {
      return this.$store.state.app.dateChanged
    },
    domainChanged () {
      return this.$store.state.app.domainChanged
    },
    rawData () {
      return this.$store.state.app.data.browserData
    },
    topBrowserAggregatedData () {
      const rawData = this.$store.state.app.data.browserData
      return utils.rawDataAggregation(rawData, this.columnsTopBrowser)
    },
    topPlatformAggregatedData () {
      const rawData = this.$store.state.app.data.browserData
      return utils.rawDataAggregation(rawData, this.columnsTopPlatform)
    },
    topBrowserDetailsAggregatedData () {
      const rawData = this.$store.state.app.data.browserData
      return utils.rawDataAggregation(rawData, this.columnsTopBrowserDetails)
    }
  },
  watch: {
    dateChanged () {
      this.fetchBrowserData()
    },
    domainChanged () {
      this.fetchBrowserData()
    }
  },
  mounted () {
    this.fetchBrowserData()
  },
  methods: {
    async fetchBrowserData () {
      this.isLoading = true

      await this.$store.dispatch('fetchData', {
        endpoint: 'browser/visits',
        mutation: 'setBrowserData',
        domainInParamaters: true
      })

      this.isLoading = false
    }
  }
}
</script>
