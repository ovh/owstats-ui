<template>
  <div
    v-if="isComponentDisplayed"
    class="domain-selection"
  >
    <div class="oui-field__header">
      <label class="oui-field__label">{{ $t('domain_selection') }}</label>
    </div>
    <section
      v-if="isComponentDisplayed"
      class="domain-selection-wrapper"
    >
      <b-autocomplete
        v-model="display"
        open-on-focus
        :placeholder="placeholder"
        clear-on-select
        :data="filteredOptions"
        @select="e => onChange(e)"
      >
        <template #empty>
          {{ noResult }}
        </template>
      </b-autocomplete>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DomainSelection',
  data () {
    let selection = ''
    if (this.$store.state.app.domainSelected === 'all') {
      selection = this.$t('select_all')
    } else {
      selection = this.$store.state.app.domainSelected
    }
    return {
      selected: selection,
      display: '',
      placeholder: selection,
      noResult: this.$t('noresult')
    }
  },
  computed: {
    isComponentDisplayed () {
      return this.$store.state.app.domains.length > 1
    },
    isCdn () {
      return this.$store.state.app.dataSource === 'cdn'
    },
    options () {
      let domainList
      if (this.isCdn) {
        domainList = this.$store.state.app.cdnDomains
      } else {
        domainList = this.$store.state.app.domains.slice()
        domainList.unshift(this.$t('select_all'))
      }

      return domainList
    },
    filteredOptions () {
      return this.options.filter((e) => {
        return e
          .toString()
          .toLowerCase()
          .indexOf(this.display.toLowerCase()) >= 0
      })
    }
  },
  watch: {
    isCdn () {
      if (this.isCdn && !this.$store.state.app.cdnDomains.includes(this.$store.state.app.domainSelected)) {
        this.$store.commit('setDomainSelected', this.$store.state.app.cdnDomains[0])
        this.$store.commit('toggleDomainChanged')
        this.placeholder = this.$store.state.app.cdnDomains[0]
      }
      if (!this.isCdn && !this.$store.state.app.domains.includes(this.$store.state.app.domainSelected)) {
        this.$store.commit('setDomainSelected', 'all')
        this.$store.commit('toggleDomainChanged')
        this.placeholder = this.$t('select_all')
      }
    }
  },
  methods: {
    onChange (e) {
      if (e) {
        if (e === this.$t('select_all')) {
          this.$store.commit('setDomainSelected', 'all')
        } else {
          this.$store.commit('setDomainSelected', e)
        }
        this.$store.commit('toggleDomainChanged')
        this.placeholder = e
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.domain-selection-wrapper /deep/ {
  @import "~bulma/bulma.sass";
  @import "~buefy/src/scss/buefy.scss";
}
</style>
