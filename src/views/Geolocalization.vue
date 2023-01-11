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
                {{ $t('geoloc.heatmap') }}
              </h4>
              <heat-map
                id="heat-map"
                :raw-data="geolocalizationVisits"
                :map-columns="mapColumns"
                :map-title="$t('dashboard.visits')"
              />
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card class="card-margin">
              <h4 class="oui-heading_4">
                {{ $t('geoloc.topRegions') }}
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
  <!-- /.content -->
</template>

<script>
import DateTimePicker from '../components/basicComponents/DateTimePicker'
import DomainSelection from '../components/basicComponents/DomainSelection.vue'
import HeatMap from '../components/dashboards//HeatMap'
import PlainTable from '../components/basicComponents/PlainTable'
import { BRow, BCol, BCard } from 'bootstrap-vue'
import utils from '../services/utils.js'

export default {
  name: 'Geoloc',
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
          label: 'geoloc.id'
        },
        {
          key: 'country',
          label: 'geoloc.country'
        },
        {
          key: 'count',
          label: 'geoloc.count'
        },
        {
          key: 'ratio',
          label: 'geoloc.ratio'
        }
      ],
      columnsTopRegion: [
        {
          key: 'id',
          label: 'geoloc.id'
        },
        {
          key: 'country',
          label: 'geoloc.country'
        },
        {
          key: 'region',
          label: 'geoloc.region'
        },
        {
          key: 'count',
          label: 'geoloc.count'
        },
        {
          key: 'ratio',
          label: 'geoloc.ratio'
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
    geolocalizationVisits () {
      return this.$store.state.app.data.geolocalizationVisitsData
    },
    topRegionAggregatedData () {
      const rawData = this.$store.state.app.data.geolocalizationVisitsData
      return utils.rawDataAggregation(rawData, this.columnsTopRegion)
    }
  },
  watch: {
    dateChanged () {
      this.fetchGeolocalizationData()
    },
    domainChanged () {
      this.fetchGeolocalizationData()
    }
  },
  mounted () {
    this.fetchGeolocalizationData()
  },
  methods: {
    async fetchGeolocalizationData () {
      this.isLoading = true

      await this.$store.dispatch('fetchData', {
        endpoint: 'geolocalization/visits',
        mutation: 'setGeolocalizationVisitsData',
        domainInParamaters: true,
        isCdn: this.isCdn
      })

      this.isLoading = false
    }
  }
}
</script>
