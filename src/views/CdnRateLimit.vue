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
                {{ $t('cdn_ratelimit.heatmap') }}
              </h4>
              <heat-map
                id="heat-map"
                :raw-data="rateLimitData"
                :map-columns="mapColumns"
                :map-title="$t('cdn_ratelimit.heatmap')"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('cdn_ratelimit.topRegions') }}
              </h4>
              <plain-table
                id="top-region"
                :aggregated-data="topRegionAggregatedData"
                :table-columns="columnsTopRegion"
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
import HeatMap from '../components/dashboards//HeatMap'
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
          label: 'cdn_ratelimit.id'
        },
        {
          key: 'country',
          label: 'cdn_ratelimit.country'
        },
        {
          key: 'count',
          label: 'cdn_ratelimit.count'
        },
        {
          key: 'ratio',
          label: 'cdn_ratelimit.ratio'
        }
      ],
      columnsTopRegion: [
        {
          key: 'id',
          label: 'cdn_ratelimit.id'
        },
        {
          key: 'country',
          label: 'cdn_ratelimit.country'
        },
        {
          key: 'region',
          label: 'cdn_ratelimit.region'
        },
        {
          key: 'count',
          label: 'cdn_ratelimit.count'
        },
        {
          key: 'ratio',
          label: 'cdn_ratelimit.ratio'
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
    rateLimitData () {
      return this.$store.state.app.data.cdnRateLimitData
    },
    topRegionAggregatedData () {
      const rawData = this.$store.state.app.data.cdnRateLimitData
      return utils.rawDataAggregation(rawData, this.columnsTopRegion)
    }

  },
  watch: {
    isCdn () {
      this.$router.replace({
        path: 'dashboard'
      })
    },
    dateChanged () {
      this.fetchRateLlimitData()
    },
    domainChanged () {
      this.fetchRateLlimitData()
    }
  },
  mounted () {
    this.fetchRateLlimitData()
  },
  methods: {
    async fetchRateLlimitData () {
      this.isLoading = true

      Promise.all([
        this.$store.dispatch('fetchData', {
          endpoint: 'cdn/ratelimit',
          mutation: 'setCdnRateLimitData',
          domainInParamaters: true
        })
      ]).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
