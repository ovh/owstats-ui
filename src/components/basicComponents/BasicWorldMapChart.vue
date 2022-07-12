<template>
  <div
    id="data_source_world_map"
    class="geo-simple"
  />
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import variables from '../../assets/sass/_variables.scss'

export default {
  name: 'BasicWorldMapChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    reverseColor: {
      type: Boolean,
      default: false
    },
    visualMapText: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      countriesJson: null
    }
  },
  watch: {
    data () {
      if (this.countriesJson) {
        this.createMap()
      }
    }
  },
  mounted () {
    let countriesUrl
    if (process.env.VUE_APP_PUBLIC_PATH) {
      countriesUrl = `${process.env.VUE_APP_PUBLIC_PATH}${this.$geoJson}`
    } else {
      countriesUrl = `/${this.$geoJson}`
    }

    axios.get(countriesUrl).then(response => {
      this.countriesJson = response
      this.createMap()
    })
  },
  methods: {
    createMap () {
      let _color = ['#eee']
      let _calculable = false
      // If data is empty echarts fills the map with the pallet's "mean" color
      if (this.data.length > 0) {
        if (this.reverseColor) {
          _color = [variables.p700, variables.p100]
        } else {
          _color = [variables.p100, variables.p700]
        }
        _calculable = true
      }

      const countries = this.countriesJson.data
      echarts.registerMap('World', countries)

      const dataSource = echarts.init(document.getElementById('data_source_world_map'))
      const option = {
        textStyle: {
          fontFamily: variables.fontFamily
        },
        visualMap: {
          type: 'continuous',
          left: 'left',
          min: this.min,
          max: this.max,
          inRange: {
            color: _color
          },
          outOfRange: {
            color: '#eee'
          },
          calculable: _calculable,
          text: this.visualMapText
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter (params) {
            let value = (params.value + '').split('.')
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1 ')
            if (value === 'NaN') {
              value = '0'
            }
            return params.seriesName + '<br/>' + params.name + ': ' + value
          }
        },
        toolbox: {
          show: true,
          left: 'left',
          top: 'top',
          feature: {
            restore: {
              title: 'Restore',
              icon: 'path://M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
            },
            saveAsImage: {
              title: 'Save as image'
            }
          }
        },
        series: [
          {
            name: this.name,
            type: 'map',
            map: 'World',
            roam: true,
            zoom: 1.25,
            itemStyle: {
              emphasis: {
                areaColor: variables.orangeGraph
              }
            },
            data: this.data
          }
        ]
      }

      setTimeout(() => {
        dataSource.setOption(option)
        dataSource.resize()
      }, 1000)
      window.addEventListener('resize', () => {
        dataSource.resize()
      })
    }
  }
}
</script>

<style scoped>
  .geo-simple {
    width: 100%;
    height: 600px;
  }
</style>
