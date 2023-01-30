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
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('request.topPaths') }}
              </h4>
              <chart-and-table
                id="top-paths"
                :table-columns="columnsTopPath"
                chart-name="request.topPaths"
                :table-size="10"
                :chart-size="3"
                :aggregated-data="topPathAggregatedData"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            data-toggle="tooltip"
            :title="$t('tooltips.topform')"
          >
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('request.topForm') }}
              </h4>
              <plain-table
                id="top-form"
                :aggregated-data="topFormAggregatedData"
                :table-columns="columnsTopForm"
                :table-size="10"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('request.topInitial') }}
              </h4>
              <plain-table
                id="top-initial"
                :aggregated-data="topInitialAggregatedData"
                :table-columns="columnsTopInitial"
                :table-size="10"
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
import ChartAndTable from '../components/basicComponents/ChartAndTable'
import PlainTable from '../components/basicComponents/PlainTable'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import utils from '../services/utils.js'

export default {
  name: 'Request',
  components: {
    DateTimePicker,
    DomainSelection,
    ChartAndTable,
    PlainTable,
    BRow,
    BCol,
    BCard
  },
  data () {
    return {
      isLoading: true,
      columnsTopPath: [
        {
          key: 'id',
          label: 'request.id'
        },
        {
          key: 'request_origfilepath',
          label: 'request.origfilepath'
        },
        {
          key: 'count',
          label: 'request.validhits'
        },
        {
          key: 'ratio',
          label: 'request.ratio'
        }
      ],
      columnsTopForm: [
        {
          key: 'id',
          label: 'request.id'
        },
        {
          key: 'post_form',
          label: 'request.post_form'
        },
        {
          key: 'count',
          label: 'request.validhits'
        },
        {
          key: 'ratio',
          label: 'request.ratio'
        }
      ],
      columnsTopInitial: [
        {
          key: 'id',
          label: 'request.id'
        },
        {
          key: 'page_1',
          label: 'request.page_1'
        },
        {
          key: 'page_2',
          label: 'request.page_2'
        },
        {
          key: 'page_3',
          label: 'request.page_3'
        },
        {
          key: 'count',
          label: 'request.visits'
        },
        {
          key: 'ratio',
          label: 'request.ratio'
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
    topPathAggregatedData () {
      const rawData = this.$store.state.app.data.requestorigfilepathValidhitsData
      return utils.rawDataAggregation(rawData, this.columnsTopPath)
    },
    topFormAggregatedData () {
      const rawData = this.$store.state.app.data.requestformValidhitsData
      return utils.rawDataAggregation(rawData, this.columnsTopForm)
    },
    topInitialAggregatedData () {
      const rawData = this.$store.state.app.data.initialpathVisitsData
      return utils.rawDataAggregation(rawData, this.columnsTopInitial)
    }
  },
  watch: {
    dateChanged () {
      this.fetchRequestData()
    },
    domainChanged () {
      this.fetchRequestData()
    }
  },
  mounted () {
    this.fetchRequestData()
  },

  methods: {
    fetchRequestData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'initial_path/visits',
          mutation: 'setInitialpathVisitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'request_form/validhits',
          mutation: 'setRequestformValidhitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'request_origfilepath/validhits',
          mutation: 'setRequestorigfilepathValidhitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        })
      ]).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
