<template>
  <div id="app">
    <Login v-if="isLoginNeeded" />
    <Layout v-if="isLoaded" />
  </div>
</template>

<script>
import Layout from './layout/Layout.vue'
import Login from './views/Login.vue'
import moment from 'moment-timezone'
import utils from './services/utils'

export default {
  name: 'App',
  components: {
    Layout,
    Login
  },

  data () {
    return {
      isLoaded: false,
      isTargetRemoteApi: process.env.VUE_APP_TARGET_REMOTE_API === 'true',
      nodeEnv: process.env.NODE_ENV,
      isTokenInCookie: utils.getTokenFromCookie()
    }
  },

  computed: {
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    },
    dateChanged () {
      return this.$store.state.app.dateChanged
    },
    domainChanged () {
      return this.$store.state.app.domainSelected
    },
    isLoginNeeded () {
      return this.isTargetRemoteApi && this.nodeEnv === 'production' && !this.isTokenInCookie
    },
    startDate () {
      return moment().subtract(5, 'years').format('YYYY-MM-DD')
    }
  },
  watch: {
    isCdn () {
      this.updateQuery()
    },
    dateChanged () {
      this.updateQuery()
    },
    domainChanged () {
      this.updateQuery()
    }

  },
  async beforeMount () {
    if (!this.isLoginNeeded) {
      // create token for local dev
      if (this.nodeEnv === 'development') {
        const token = await utils.generateToken()
        const inOneHour = 1 / 24
        utils.setTokenInCookie(token, inOneHour)
      }
      await this.setMainDomain()

      await this.setCluster()

      await this.setDomains()

      await this.setCdnDomains()

      await this.setTimezone()

      await this.updateQuery()

      this.isLoaded = true
    }
  },
  methods: {
    async setMainDomain () {
      const origin = document.location.origin
      const href = document.location.href
      let mainDomain = href.replace(origin + '/', '')
      mainDomain = mainDomain.replace(new RegExp('/owstats.*'), '')
      await this.$store.commit('setMainDomain', mainDomain)
    },
    async setCluster () {
      const url = process.env.VUE_APP_API_BASE_URL || window.location.href
      await this.$store.commit('setCluster', url.split('.')[1])
    },
    async setDomains () {
      await this.$store.dispatch('fetchData', {
        startDate: this.startDate,
        endDate: moment().format('YYYY-MM-DD'),
        endpoint: 'domains',
        mutation: 'updateDomains'
      })
    },

    async setCdnDomains () {
      await this.$store.dispatch('fetchData', {
        startDate: this.startDate,
        endDate: moment().format('YYYY-MM-DD'),
        endpoint: 'cdn/domains',
        mutation: 'updateCdnDomains',
        isCdn: true
      })
    },

    setTimezone () {
      this.$store.dispatch('setTimezone')
    },

    updateQuery () {
      const queryStart = this.$route.query.start_date
      let queryEnd = this.$route.query.end_date
      if (!queryEnd) {
        queryEnd = this.$route.query.start_date
      }
      let queryDomain = this.$route.query.domain
      if (!queryDomain) {
        queryDomain = 'all'
      }

      let queryDataSource = this.$route.query.dataSource
      if (!queryDataSource) {
        queryDataSource = 'webhosting'
      }

      const storeStart = this.$store.state.app.startDate
      let storeEnd = this.$store.state.app.endDate
      if (!storeEnd) {
        storeEnd = this.$store.state.app.startDate
      }
      let storeDomain = this.$store.state.app.domainSelected
      if (!storeDomain) {
        storeDomain = 'all'
      }

      const storeDataSource = this.$store.state.app.dataSource

      if (this.isLoaded) {
        if (queryDomain !== storeDomain ||
        queryStart !== storeStart ||
        queryEnd !== storeEnd ||
        queryDataSource !== storeDataSource) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              start_date: storeStart,
              end_date: storeEnd,
              domain: storeDomain,
              dataSource: storeDataSource
            }
          })
        }
      } else {
        this.$store.commit('setStartDate', queryStart || storeStart)
        this.$store.commit('setEndDate', queryEnd || storeEnd)
        this.$store.commit('setDomainSelected', queryDomain || storeDomain)
        this.$store.commit('setDataSource', queryDataSource || storeDataSource)
      }
    }
  }
}
</script>

<style lang="scss">
@import "./assets/sass/main";
</style>
