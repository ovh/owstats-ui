<template>
  <b-card class="card-margin">
    <div>
      <b-row>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.pages')"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg" />
              <i class="oui-icon oui-icon-book-open_concept" />
            </div>
            <div class="widget-numbers">
              {{ totalPages }}
            </div>
            <div class="widget-subheading">
              {{ $t("dashboard.totalPages") }}
            </div>
          </div>
        </b-col>

        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.sessions')"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg" />
              <i class="oui-icon oui-icon-user_concept" />
            </div>
            <div class="widget-numbers">
              {{ totalVisits }}
            </div>
            <div class="widget-subheading">
              {{ $t("dashboard.visits") }}
            </div>
          </div>
        </b-col>

        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.sessiontime')"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg" />
              <i class="oui-icon oui-icon-clock_concept" />
            </div>
            <div class="widget-numbers">
              {{ avgSessionTime }}
            </div>
            <div class="widget-subheading">
              {{ $t("dashboard.avgsessiontime") }}
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
import moment from 'moment-timezone'
import utils from '../../services/utils.js'

export default {
  name: 'DomainInfo',
  props: {
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    visits: {
      type: Object,
      required: true
    },
    pages: {
      type: Object,
      required: true
    },
    session: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      totalVisits: 0,
      totalPages: 0,
      avgSessionTime: 0
    }
  },
  mounted () {
    this.loadingInfo()
  },
  methods: {
    loadingInfo () {
      const visits = this.visits
      const pages = this.pages
      const start = this.startDate
      const end = this.endDate
      let period = 'hours'

      const dayFormat = 'YYYY-MM-DD'
      const weekFormat = 'GGGG-[W]WW' /* Use ISO year GGGG with ISO week WW */
      const monthFormat = 'YYYY-MM'
      const yearFormat = 'YYYY'
      const timeFormat = 'YYYY-MM-DDTHH:mm:ss[Z]'

      this.totalVisits = 0
      this.totalPages = 0
      this.avgSessionTime = 0
      this.totalError = 0

      this.avgSessionTime = utils.computeAvgSessionTime(this.session, this.visits, this.startDate, this.endDate)

      for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, period)) {
        const day = m.format(dayFormat)
        const week = m.format(weekFormat)
        const month = m.format(monthFormat)
        const year = m.format(yearFormat)
        const time = m.format(timeFormat)

        let v = null
        let p = null
        let compute = 0

        if (day in visits || day in pages) {
          period = 'hours'
          v = visits[day] ? visits[day].visits : undefined
          p = pages[day] ? pages[day].pages : undefined
          compute = 1
        } else if (week in visits || week in pages) {
          period = 'hours'
          v = visits[week] ? visits[week].visits : undefined
          p = pages[week] ? pages[week].pages : undefined
          compute = 1
        } else if (month in visits || month in pages) {
          period = 'days'
          v = visits[month] ? visits[month].visits : undefined
          p = pages[month] ? pages[month].pages : undefined
          compute = 1
        } else if (year in visits || year in pages) {
          period = 'days'
          v = visits[year] ? visits[year].visits : undefined
          p = pages[year] ? pages[year].pages : undefined
          compute = 1
        }

        if (compute) {
          const recordVisits = v ? v.find(elem => elem.time === time) : undefined
          if (recordVisits) this.totalVisits += parseInt(recordVisits.value)

          const recordPages = p ? p.find(elem => elem.time === time) : undefined
          if (recordPages) this.totalPages += parseInt(recordPages.value)
        }
      }
    }
  }
}
</script>
