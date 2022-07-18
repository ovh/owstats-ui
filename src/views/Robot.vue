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
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('robots.topRobot') }}
              </h4>
              <chart-and-table
                id="top-robot"
                :table-columns="columnsTopRobot"
                chart-name="robots.topRobot"
                :table-size="3"
                :chart-size="3"
                :aggregated-data="topRobotAggregatedData"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('robots.topRobotDetailed') }}
              </h4>
              <plain-table
                id="top-robot-detailed"
                :aggregated-data="topRobotDetailedAggregatedData"
                :table-columns="columnsTopRobotDetailed"
                :table-size="10"
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
import ChartAndTable from '../components/basicComponents/ChartAndTable'
import PlainTable from '../components/basicComponents/PlainTable'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import utils from '../services/utils.js'

export default {
  name: 'Robot',
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
      columnsTopRobot: [
        {
          key: 'id',
          label: 'robots.id'
        },
        {
          key: 'robot_agent',
          label: 'robots.robots'
        },
        {
          key: 'count',
          label: 'robots.validhits'
        },
        {
          key: 'ratio',
          label: 'robots.ratio'
        }
      ],
      columnsTopRobotDetailed: [
        {
          key: 'id',
          label: 'robots.id'
        },
        {
          key: 'robot_agent',
          label: 'robots.robot_agent'
        },
        {
          key: 'request_origfilepath',
          label: 'robots.page'
        },
        {
          key: 'count',
          label: 'robots.hits'
        },
        {
          key: 'ratio',
          label: 'robots.ratio'
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
    topRobotAggregatedData () {
      const rawData = this.$store.state.app.data.robotsValidhitsData
      return utils.rawDataAggregation(rawData, this.columnsTopRobot)
    },
    topRobotDetailedAggregatedData () {
      const rawData = this.$store.state.app.data.robotspagesHitsData
      return utils.rawDataAggregation(rawData, this.columnsTopRobotDetailed)
    }
  },
  watch: {
    dateChanged () {
      this.fetchRobotData()
    },
    domainChanged () {
      this.fetchRobotData()
    }
  },
  mounted () {
    this.fetchRobotData()
  },

  methods: {
    fetchRobotData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'robots_pages/hits',
          mutation: 'setRobotspagesHitsData',
          domainInParamaters: true,
          isCdn: this.isCdn
        }),
        this.$store.dispatch('fetchData', {
          endpoint: 'robots/validhits',
          mutation: 'setRobotsValidhitsData',
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
