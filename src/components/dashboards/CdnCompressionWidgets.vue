<template>
  <b-card class="card-margin">
    <div>
      <b-row>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
          >
            <div class="widget-subheading">
              {{ $t('cdn_compression.brotli') }}
            </div>
            <div class="widget-numbers">
              {{ compressionBrotli }}
            </div>
          </div>
        </b-col>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
          >
            <div class="widget-subheading">
              {{ $t('cdn_compression.gzip') }}
            </div>
            <div class="widget-numbers">
              {{ compressionGzip }}
            </div>
          </div>
        </b-col>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
          >
            <div class="widget-subheading">
              {{ $t('cdn_compression.plain') }}
            </div>
            <div class="widget-numbers">
              {{ compressionPlain }}
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
    compression: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      compressionBrotli: 0,
      compressionPlain: 0,
      compressionGzip: 0
    }
  },
  mounted () {
    this.loadingInfo()
  },
  methods: {
    computeNumberOfRequests (compressionData, date, encodingType) {
      const compression = compressionData[date].encoding.filter(e => e.param === encodingType)
      const compressionRequests = compression.map(e => parseInt(e.value))
      return compressionRequests.reduce((a, b) => a + b, 0)
    },
    loadingInfo () {
      const compression = this.compression

      for (const date in compression) {
        this.compressionBrotli += this.computeNumberOfRequests(compression, date, 'brotli')
        this.compressionPlain += this.computeNumberOfRequests(compression, date, 'plain')
        this.compressionGzip += this.computeNumberOfRequests(compression, date, 'gzip')
      }
    }
  }
}
</script>
