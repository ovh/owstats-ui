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
          :header="$t('menu.faq')"
          link="faq"
          index="faq"
        />
      </ul>
    </div>
  </nav>
</template>

<script>
import NavLink from './NavLink'

export default {
  name: 'Sidebar',
  components: { NavLink }
}
</script>
