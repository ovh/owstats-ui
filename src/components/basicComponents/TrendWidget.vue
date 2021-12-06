<template>
  <div>
    <b-row>
      <b-col
        data-toggle="tooltip"
        :title="tooltip"
      >
        <section>
          <h4 class="oui-heading_4">
            {{ $t(title, scale) }}
          </h4>
          <div class="d-flex justify-content-between align-items-center mb-lg">
            <div class="trend-subtitle">
              {{ subtitle }}
              <i
                v-if="trendType === 'up'"
                class="oui-icon oui-icon-arrow-up-right"
                :class="type"
              />
              <i
                v-if="trendType === 'down'"
                class="oui-icon oui-icon-arrow-down-right"
                :class="type"
              />
            </div>
          </div>
        </section>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { BRow, BCol } from 'bootstrap-vue'

export default {
  name: 'TrendWidget',
  components: {
    BRow,
    BCol
  },
  props: {
    baseTitle: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    statusN1: {
      type: Object,
      required: true
    },
    statusN2: {
      type: Object,
      required: true
    },
    codeMin: {
      type: Number,
      required: true
    },
    codeMax: {
      type: Number,
      required: true
    },
    baseTrendType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: this.baseTitle,
      scale: {
        count: 0
      },
      subtitle: '',
      trendType: 'up',
      type: this.baseTrendType
    }
  },
  mounted () {
    this.loadingStatus()
  },
  methods: {
    loadingStatus () {
      const start = moment(this.startDate).tz('UTC')
      const end = moment(this.endDate).tz('UTC')
      const diff = end.diff(start, 'days') + 1

      const statusN1 = this.computeValue(this.statusN1, 'pages')
      const statusN2 = this.computeValue(this.statusN2, 'pages')
      let ratio = 0

      if (statusN1 && statusN2) {
        ratio = ((statusN1 - statusN2) * 100) / statusN1

        let sign = ''
        if (ratio > 0) {
          sign = '+'
        }

        this.subtitle = `${statusN1} (${sign}${ratio.toFixed(1)} %)`
      } else {
        this.subtitle = `${statusN1} (- %)`
      }

      this.scale.count = diff
      if (diff > 1) {
        this.title = this.baseTitle + '_ndays'
      } else {
        this.title = this.baseTitle
      }

      if (statusN1 > statusN2) {
        this.trendType = 'up'
      } else {
        this.trendType = 'down'
        if (this.type === 'text-success') {
          this.type = 'text-danger'
        } else {
          this.type = 'text-success'
        }
      }
    },
    computeValue (records, type) {
      let total = 0

      /* Aggregate results */
      for (const key in records) {
        for (const d in records[key][type]) {
          const record = records[key][type][d]
          const v = parseInt(record.value)
          const code = parseInt(record.status_code)

          if ((code >= this.codeMin) && (code < this.codeMax)) {
            total += v
          }
        }
      }
      return total
    }
  }
}
</script>

<style>
 .rotate-315 {
   transform: rotate(315deg);
   font-size: 25px;
 }

 .rotate-45 {
   transform: rotate(45deg);
   font-size: 25px;
 }

 h4 {
   text-align: center;
   display: block;
 }

</style>
