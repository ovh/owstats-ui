<template>
  <b-row>
    <b-col
      v-for="d in subdomainsValidPagesTable.slice(0, 4)"
      :key="d.domains"
    >
      <b-card
        data-cy="top-domain-card"
        class="card-margin"
      >
        <div class="card-title border-bottom-0 text-center">
          <h4 class="oui-heading_4">
            {{ d.domains }}
          </h4>
        </div>
        <b-row>
          <b-col class="col-sm-6">
            <div
              class="dashb-widget-chart"
              data-toggle="tooltip"
              :title="$t('tooltips.pages')"
            >
              <div class="icon-wrapper rounded-circle">
                <div class="icon-wrapper-bg bg-success" />
                <span class="oui-icon oui-icon-success" />
              </div>
              <div
                data-cy="top-domain-valid-pages"
                class="widget-numbers"
              >
                {{ d.validPages }}
              </div>
              <div class="widget-subheading">
                {{ $t('dashboard.short_pages') }}
              </div>
            </div>
          </b-col>
          <b-col class="col-sm-6">
            <div
              class="dashb-widget-chart"
              data-toggle="tooltip"
              :title="$t('tooltips.errorpages')"
            >
              <div class="icon-wrapper rounded-circle">
                <div class="icon-wrapper-bg bg-danger" />
                <span class="oui-icon oui-icon-error" />
              </div>
              <div
                data-cy="top-domain-error-pages"
                class="widget-numbers"
              >
                {{ d.errorPages }}
              </div>
              <div class="widget-subheading">
                {{ $t('dashboard.short_errorpages') }}
              </div>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import utils from '../../services/utils.js'

export default {
  name: 'TopDomains',
  props: {
    error: {
      type: Object,
      required: true
    },
    hits: {
      type: Object,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      subdomainsValidPagesTable: [],
      isDomainsValidPages: true,
      data: []
    }
  },
  mounted () {
    this.loadingTopDomains()
  },
  methods: {
    loadingTopDomains () {
      this.loadingTopDomainsValidPages()
      this.isDomainsValidPages = true
    },
    loadingTopDomainsValidPages () {
      const hits = this.hits
      const errorPages = this.error
      this.subdomainsValidPagesTable = this.populateRecords(hits, errorPages)
    },
    hitsPerKey (hits, tag) {
      const hitsPerKey = {}

      /* Aggregate results */
      for (const key in hits) {
        for (const d in hits[key][tag]) {
          const record = hits[key][tag][d]
          const v = parseInt(record.value)
          const entry = record.subdomain
          if (entry in hitsPerKey) {
            hitsPerKey[entry] += v
          } else {
            hitsPerKey[entry] = v
          }
        }
      }

      return hitsPerKey
    },
    populateRecords (hits, errorPages) {
      const max = 3
      const validPagesPerKey = this.hitsPerKey(hits, 'validpages')
      const errorPagesPerKey = this.hitsPerKey(errorPages, 'errorpages')

      const { keys, data } = utils.reversePerKeyObject(validPagesPerKey)

      let count = 0
      const values = []

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (count >= max) {
          break
        }
        const subdomains = data[key]
        for (let j = 0; j < subdomains.length; j++) {
          const subdomain = subdomains[j]
          if (count >= max) {
            break
          }
          count += 1

          values.push({
            id: count,
            domains: subdomain,
            validPages: key,
            errorPages: errorPagesPerKey[subdomain] ? errorPagesPerKey[subdomain] : 0
          })
        }
      }
      return values
    }
  }
}
</script>
