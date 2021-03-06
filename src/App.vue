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
    dateChanged () {
      return this.$store.state.app.dateChanged
    },
    domainChanged () {
      return this.$store.state.app.domainSelected
    },
    isLoginNeeded () {
      return this.isTargetRemoteApi && this.nodeEnv === 'production' && !this.isTokenInCookie
    }
  },
  watch: {
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
      this.setMainDomain()

      this.setDomains()

      this.updateQuery()

      this.isLoaded = true
    }
  },
  methods: {
    setMainDomain () {
      const origin = document.location.origin
      const href = document.location.href
      let mainDomain = href.replace(origin + '/', '')
      mainDomain = mainDomain.replace(new RegExp('/owstats.*'), '')
      this.$store.commit('setMainDomain', mainDomain)
    },
    setDomains () {
      this.$store.dispatch('fetchData', {
        startDate: '2012-01-01',
        endDate: moment().format('YYYY-MM-DD'),
        endpoint: 'domains',
        mutation: 'updateDomains'
      })
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

      const storeStart = this.$store.state.app.startDate
      let storeEnd = this.$store.state.app.endDate
      if (!storeEnd) {
        storeEnd = this.$store.state.app.startDate
      }
      let storeDomain = this.$store.state.app.domainSelected
      if (!storeDomain) {
        storeDomain = 'all'
      }

      if (this.isLoaded) {
        if (queryDomain !== storeDomain ||
        queryStart !== storeStart ||
        queryEnd !== storeEnd) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              start_date: storeStart,
              end_date: storeEnd,
              domain: storeDomain
            }
          })
        }
      } else {
        this.$store.commit('setStartDate', queryStart || storeStart)
        this.$store.commit('setEndDate', queryEnd || storeEnd)
        this.$store.commit('setDomainSelected', queryDomain || storeDomain)
      }
    }
  }
}
</script>

<style lang="scss">
@import "./assets/sass/main";
</style>
