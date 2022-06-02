<template>
  <nav
    id="header"
    class="oui-navbar"
    role="navigation"
  >
    <div
      id="header-sidebar-toggler"
      class="oui-navbar-toggler oui-navbar-toggler_button"
      type="button"
      aria-haspopup="true"
      aria-expanded="false"
      @click="toggleSidebar"
    >
      <span class="oui-navbar-toggler__hamburger"> <span /> <span /> <span /> <span /> </span>
    </div>
    <a
      class="oui-navbar__brand"
      href
    >
      <span class="oui-icon oui-icon-ovh" />
    </a>
    <ul class="oui-navbar-list navbar-large">
      <li class="oui-navbar-list__item">
        <a
          class="oui-navbar-link oui-navbar-link_primary"
          href
        >{{ "navbar.title" | translate }} &nbsp; - &nbsp; {{ this.$store.state.app.mainDomain }}
        </a>
      </li>
    </ul>

    <ul
      v-if="dataSourceSelectionDisplay"
      class="oui-navbar-list"
    >
      <li class="oui-navbar-list__item">
        <button
          :class="classDataSourceButton('webhosting')"
          @click="setDataSource('webhosting')"
        >
          WEBHOSTING
        </button>
      </li>
      <li class="oui-navbar-list__item">
        <button
          :class="classDataSourceButton('cdn')"
          @click="setDataSource('cdn')"
        >
          CDN
        </button>
      </li>
    </ul>
    <button
      v-if="logoutButtonDisplay"
      class="oui-button oui-button_ghost logout-button"
      @click="removeTokenFromCookie"
    >
      Logout
    </button>
  </nav>
</template>

<script>
import utils from '../services/utils.js'
import router from '../router'

export default {
  name: 'Header',
  data () {
    return {
      isTargetRemoteApi: process.env.VUE_APP_TARGET_REMOTE_API === 'true',
      nodeEnv: process.env.NODE_ENV,
      isTokenInCookie: utils.getTokenFromCookie()
    }
  },
  computed: {
    logoutButtonDisplay () {
      if (this.isTargetRemoteApi && this.nodeEnv === 'production' && this.isTokenInCookie) {
        return true
      } else {
        return false
      }
    },
    dataSourceSelectionDisplay () {
      return this.$store.state.app.cdnDomains.length > 0
    }
  },
  created () {
    this.logsUrl = window.location.host + '/'
  },
  methods: {
    setDataSource (dataSource) {
      this.$store.commit('setDataSource', dataSource)
    },
    toggleSidebar () {
      this.$store.commit('toggleSidebar')
    },
    removeTokenFromCookie () {
      utils.removeTokenFromCookie()
      router.go()
    },
    classDataSourceButton (dataSource) {
      if (this.$store.state.app.dataSource === dataSource) {
        return 'oui-button oui-button_ghost oui-sidebar-link_active'
      } else {
        return 'oui-button oui-button_ghost'
      }
    }

  }
}
</script>
