<template>
  <b-card class="card-margin">
    <div>
      <b-row>
        <b-col class="col-sm-3">
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
              {{ validPagesNumber }}
            </div>
            <div class="widget-subheading">
              {{ $t("dashboard.short_pages") }}
            </div>
          </div>
        </b-col>

        <b-col class="col-sm-3">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.errorpages')"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg" />
              <i class="oui-icon oui-icon-book-close_concept" />
            </div>
            <div class="widget-numbers">
              {{ errorPagesNumber }}
            </div>
            <div class="widget-subheading">
              {{ $t("dashboard.short_errorpages") }}
            </div>
          </div>
        </b-col>

        <b-col class="col-sm-3">
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

        <b-col class="col-sm-3">
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
    validPages: {
      type: Object,
      required: true
    },
    errorPages: {
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
      avgSessionTime: 0,
      validPagesNumber: 0,
      errorPagesNumber: 0
    }
  },
  mounted () {
    this.loadingInfo()
  },
  methods: {
    computeSumOfMetric (data, metric, isFilterByDomain = true) {
      let result = 0

      /* Aggregate results */
      for (const date in data) {
        for (const d in data[date][metric]) {
          const record = data[date][metric][d]
          const value = parseInt(record.value)

          if (isFilterByDomain) {
            const subdomain = record.subdomain
            if (subdomain === this.$store.state.app.domainSelected || this.$store.state.app.domainSelected === 'all') {
              result += value
            }
          } else {
            result += value
          }
        }
      }
      return result
    },
    loadingInfo () {
      this.validPagesNumber = this.computeSumOfMetric(this.validPages, 'validpages', true)
      this.errorPagesNumber = this.computeSumOfMetric(this.errorPages, 'errorpages', true)
      this.totalVisits = this.computeSumOfMetric(this.visits, 'visits', false)
      this.avgSessionTime = utils.computeAvgSessionTime(this.session, this.visits, this.startDate, this.endDate)
    }
  }
}
</script>
