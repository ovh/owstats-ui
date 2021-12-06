<template>
  <div class="wrapper">
    <headerbar />
    <div class="main-panel">
      <sidebar :class="{ 'sidebar-active':sidebarOpened}" />
      <router-view class="main-content" />
    </div>
  </div>
</template>

<script>
import Headerbar from './Header'
import Sidebar from './Sidebar'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Headerbar
  },
  computed: {
    sidebarOpened () {
      return this.$store.state.app.sidebar.opened
    }
  }
}
</script>
