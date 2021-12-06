<template>
  <apex-chart
    v-if="series"
    :width="width"
    :height="height"
    type="area"
    :options="options"
    :series="series"
  />
</template>

<script>
import VueApexcharts from 'vue-apexcharts'
import moment from 'moment-timezone'
import variables from '../../assets/sass/_variables.scss'

export default {
  name: 'BasicSplineChart',
  components: {
    'apex-chart': VueApexcharts
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    granularity: {
      type: String,
      default: 'hours'
    },
    colors: {
      type: Array,
      default: () => ['#3361FF']
    },
    data: {
      type: Array,
      required: true
    },
    xAxisData: {
      type: Array,
      required: true
    },
    xAxisType: {
      type: String,
      default: 'category'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300'
    },
    nodata: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: null,
      series: null
    }
  },
  mounted () {
    this.createSplineChart()
  },
  methods: {
    createSplineChart () {
      const granularity = this.granularity
      const date = this.$t('date')
      let options = {
        chart: {
          redrawOnParentResize: true,
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          fontFamily: variables.fontFamily
        },
        colors: [variables.blueGraph3, variables.orangeGraph, variables.redGraph, variables.greenGraph1],
        noData: {
          align: 'center',
          verticalAlign: 'middle',
          style: {
            fontFamily: variables.fontFamily,
            color: variables.t800
          }
        },
        legend: {
          position: 'top'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        grid: {
          row: {
            colors: [variables.white, 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.xAxisData,
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH'
            },
            style: {
              colors: variables.t800
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          type: 'value',
          labels: {
            style: {
              colors: variables.t800
            }
          }
        },
        tooltip: {
          enabled: true,
          shared: true,
          followCursor: true,
          x: {
            formatter (value) {
              const m = moment(value).tz('UTC')
              if (granularity === 'weeks') {
                return m.format(date)
              } else if (granularity === 'months') {
                return m.format('MM YYYY')
              } else if (granularity === 'days') {
                return m.format(date)
              } else {
                return m.format(date + ' HH[h]')
              }
            }
          },
          y: {
            formatter (value) {
              if (value) {
                return value
              }
            }
          }
        }
      }

      options.noData.text = this.nodata
      if (this.title) {
        options = {
          ...options,
          title: {
            text: this.title
          }
        }
      }

      this.options = options
      this.series = []
      this.series = this.data
    }
  }
}
</script>

<style scoped>
.line-basic {
  width: 100%;
  height: 300px;
}
</style>
