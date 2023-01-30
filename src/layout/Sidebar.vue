<template>
  <nav
    id="sidebar"
    class="oui-sidebar"
    :class="{'sidebar-active' : this.$store.state.app.sidebar.opened}"
  >
    <div class="oui-sidebar-menu">
      <ul class="oui-sidebar-list">
        <NavLink
          :header="$t('menu.dashboard')"
          link="dashboard"
          index="dashboard"
        />
        <NavLink
          :header="$t('menu.browser')"
          link="browser"
          index="browser"
        />
        <NavLink
          :header="$t('menu.geolocalization')"
          link="geolocalization"
          index="geolocalization"
        />
        <NavLink
          :header="$t('menu.request')"
          link="request"
          index="request"
        />
        <NavLink
          :header="$t('menu.robot')"
          link="robot"
          index="robot"
        />
        <NavLink
          :header="$t('menu.status')"
          link="status"
          index="status"
        />
        <NavLink
          v-if="isCdn"
          :header="$t('menu.cdn_cache')"
          link="cdn_cache"
          index="cdn_cache"
          :top-line="true"
        />
        <NavLink
          v-if="isCdn"
          :header="$t('menu.cdn_compression')"
          link="cdn_compression"
          index="cdn_compression"
        />
        <NavLink
          v-if="isCdn"
          :header="$t('menu.cdn_ratelimit')"
          link="cdn_ratelimit"
          index="cdn_ratelimit"
        />
        <NavLink
          v-if="isCdn"
          :header="$t('menu.cdn_security')"
          link="cdn_security"
          index="cdn_security"
        />
        <NavLink
          v-if="isCdn"
          :header="$t('menu.cdn_performance')"
          link="cdn_performance"
          index="cdn_performance"
        />
        <NavLink
          :header="$t('menu.faq')"
          link="faq"
          index="faq"
          :top-line="true"
        />
      </ul>
    </div>
  </nav>
</template>

<script>
import NavLink from './NavLink'

export default {
  name: 'Sidebar',
  components: { NavLink },
  computed: {
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    }
  }
}
</script>
