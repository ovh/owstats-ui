<template>
  <b-card class="card-margin">
    <div>
      <b-row>
        <b-col class="col-sm-6">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.cdn_security_waf')"
          >
            <div class="widget-subheading">
              {{ $t('cdn_security.waf_widget') }}
            </div>
            <div class="widget-numbers">
              {{ securityWaf }}
            </div>
          </div>
        </b-col>
        <b-col class="col-sm-6">
          <div
            class="widget-chart widget-chart-hover"
          >
            <div class="widget-subheading">
              {{ $t('cdn_security.https_redirect_widget') }}
            </div>
            <div class="widget-numbers">
              {{ securityHttpsRedirect }}
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>

export default {
  name: 'CdnCompressionWidgets',
  props: {
    waf: {
      type: Object,
      required: true
    },
    httpsRedirect: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      securityHttpsRedirect: 0,
      securityWaf: 0
    }
  },
  mounted () {
    this.loadingInfo()
  },
  methods: {
    computeNumberOfRequests (compressionData, date, type) {
      const compression = compressionData[date].waf.filter(e => e.param === type)
      const compressionRequests = compression.map(e => parseInt(e.value))
      return compressionRequests.reduce((a, b) => a + b, 0)
    },
    loadingInfo () {
      const waf = this.waf
      const httpsRedirect = this.httpsRedirect

      for (const date in waf) {
        this.securityWaf += this.computeNumberOfRequests(waf, date, 'request_blocked')
        this.securityWaf += this.computeNumberOfRequests(waf, date, 'response_blocked')
      }

      for (const date in httpsRedirect) {
        const httpsRedirectValues = httpsRedirect[date].https_redirects.map(e => parseInt(e.value))
        this.securityHttpsRedirect += httpsRedirectValues.reduce((a, b) => a + b, 0)
      }
    }
  }
}
</script>
