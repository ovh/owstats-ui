<template>
  <div>
    <apex-chart
      v-if="series"
      :width="width"
      :height="height"
      :type="type"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import variables from '../../assets/sass/_variables.scss'

export default {
  name: 'BasicPieChart',
  components: {
    'apex-chart': VueApexCharts
  },
  props: {
    labels: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300'
    },
    type: {
      type: String,
      default: 'pie'
    },
    nodata: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      series: null,
      options: null
    }
  },
  mounted () {
    this.createPieChart()
  },
  methods: {
    createPieChart () {
      const labelsTranslated = []
      this.labels.forEach(e => {
        if (e === 'Others') {
          labelsTranslated.push(this.$t('others'))
        } else {
          labelsTranslated.push(e)
        }
      })

      const options = {
        chart: {
          redrawOnParentResize: true,
          type: 'pie',
          fontFamily: variables.fontFamily
        },
        legend: {
          position: 'left',
          fontFamily: variables.fontFamily
        },
        noData: {
          align: 'center',
          verticalAlign: 'middle',
          style: {
            fontFamily: variables.fontFamily,
            color: variables.t800
          }
        },
        colors: [variables.blueGraph1, variables.orangeGraph, variables.blueGraph2, variables.blueGraph3, variables.greenGraph1, variables.greenGraph2, variables.violetGraph, variables.redGraph],
        labels: labelsTranslated,
        dataLabels: {
          style: {
            colors: [variables.white]
          }
        }
      }
      options.noData.text = this.nodata
      this.options = options
      this.series = Object.values(this.data)
    }
  }
}
</script>

<style>
  .pie-simple {
    width: 100%;
    height: 300px;
  }
</style>
