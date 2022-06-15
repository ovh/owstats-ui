<template>
  <div @click="toggleSidebar">
    <router-link
      :class="[topLine ? 'oui-sidebar-link-top-line' : '', 'oui-sidebar-link']"
      :to="link"
    >
      {{ header }}
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'NavLink',
  props: {
    header: { type: String, default: '' },
    link: { type: String, default: '' },
    index: { type: String, default: '' },
    topLine: { type: Boolean, default: false }
  },
  methods: {
    toggleSidebar () {
      this.$store.commit('toggleSidebar')
    }
  }
}
</script>
