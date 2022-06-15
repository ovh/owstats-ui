<template>
  <b-card class="card-margin">
    <div>
      <b-row>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.cache_hit_pct')"
          >
            <div class="widget-subheading">
              {{ $t('cdn_cache.cache_hit_pct') }}
            </div>
            <div class="widget-numbers">
              {{ cacheHitPercentage }}
            </div>
          </div>
        </b-col>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.bytes_hits_pct')"
          >
            <div class="widget-subheading">
              {{ $t('cdn_cache.bytes_hits_pct') }}
            </div>

            <div class="widget-numbers">
              {{ bytesHitsPercentage }}
            </div>
          </div>
        </b-col>
        <b-col class="col-sm-4">
          <div
            class="widget-chart widget-chart-hover"
            data-toggle="tooltip"
            :title="$t('tooltips.total_traffic_bytes')"
          >
            <div class="widget-subheading">
              {{ $t('cdn_cache.total_traffic_bytes') }}
            </div>
            <div class="widget-numbers">
              {{ totalTrafficBytes }}
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
  name: 'CdnCacheWidgets',
  props: {
    cache: {
      type: Object,
      required: true
    },
    bytes: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cacheHitPercentage: 0,
      totalTrafficBytes: '0',
      bytesHitsPercentage: 0
    }
  },
  mounted () {
    this.loadingInfo()
  },
  methods: {
    loadingInfo () {
      const cache = this.cache
      const bytes = this.bytes

      let totalHits = 0
      let totalMiss = 0

      for (const date in cache) {
        const cacheHits = cache[date].cache.filter(e => e.param === 'hits')
        const periodHits = cacheHits.map(e => parseInt(e.value))
        totalHits += periodHits.reduce((a, b) => a + b, 0)

        const cacheMiss = cache[date].cache.filter(e => e.param === 'miss')
        const periodMiss = cacheMiss.map(e => parseInt(e.value))
        totalMiss += periodMiss.reduce((a, b) => a + b, 0)
      }

      let totalBytesHits = 0
      let totalBytesMiss = 0
      for (const date in bytes) {
        const bytesHits = bytes[date].bytes.filter(e => e.param === 'hits')
        const periodHits = bytesHits.map(e => parseInt(e.value))
        totalBytesHits += periodHits.reduce((a, b) => a + b, 0)

        const bytesMiss = bytes[date].bytes.filter(e => e.param === 'miss')
        const periodMiss = bytesMiss.map(e => parseInt(e.value))
        totalBytesMiss += periodMiss.reduce((a, b) => a + b, 0)
      }

      this.cacheHitPercentage = (totalHits / (totalHits + totalMiss)).toPrecision(2)
      this.bytesHitsPercentage = (totalBytesHits / (totalBytesHits + totalBytesMiss)).toPrecision(2)
      this.totalTrafficBytes = utils.formatBytes(totalBytesHits + totalBytesMiss)
    }
  }
}
</script>
