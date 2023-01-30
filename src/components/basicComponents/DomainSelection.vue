<template>
  <div
    class="domain-selection"
  >
    <div class="oui-field__header">
      <label class="oui-field__label">{{ $t('domain_selection') }}</label>
    </div>
    <section
      class="domain-selection-wrapper"
    >
      <b-autocomplete
        v-model="display"
        open-on-focus
        :placeholder="placeholder"
        clear-on-select
        :data="filteredDataObj"
        field="domain.name"
        @select="e => onChange(e)"
      >
        <template slot-scope="props">
          <div>
            <span
              v-if="isBadgeDisplayed"
              class="oui-badge"
              :class="{'oui-badge_info': props.option.domain.type==='cdn', 'oui-badge_success': props.option.domain.type==='webhosting'}"
            >{{ props.option.domain.type==='cdn'? 'cdn': 'web' }} </span>
            <span>{{ props.option.domain.name }}</span>
          </div>
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
      placeholder: '',
      noResult: this.$t('noresult')
    }
  },
  computed: {
    isBadgeDisplayed () {
      return this.$store.state.app.cdnDomains.length > 0
    },
    options () {
      const domainListWeb = this.$store.state.app.domains.slice()
      domainListWeb.unshift(this.$t('select_all'))

      const domainObjectsWeb = []
      let id = 0
      domainListWeb.forEach(domain => {
        const domainObject = {
          id: id,
          domain: {
            type: 'webhosting',
            name: domain
          }
        }
        id += 1
        domainObjectsWeb.push(domainObject)
      })

      const domainListCdn = this.$store.state.app.cdnDomains.slice()
      const domainObjectsCdn = []

      id = 0
      domainListCdn.forEach(domain => {
        const domainObject = {
          id: id,
          domain: {
            type: 'cdn',
            name: domain
          }
        }
        id += 1
        domainObjectsCdn.push(domainObject)
      })

      return domainObjectsWeb.concat(domainObjectsCdn)
    },
    filteredDataObj () {
      return this.options.filter((e) => {
        return e.domain.name
          .toString()
          .toLowerCase()
          .indexOf(this.display.toLowerCase()) >= 0
      })
    }
  },
  created () {
    this.placeholder = this.getPlaceholderPrefix(this.$store.state.app.dataSource) + this.selected
  },
  methods: {
    getPlaceholderPrefix (type) {
      if (this.$store.state.app.cdnDomains.length > 0) {
        const shortType = type === 'cdn' ? 'cdn' : 'web'
        return `${shortType} - `
      } else {
        return ''
      }
    },
    onChange (e) {
      if (e) {
        const domain = e.domain.name
        const type = e.domain.type

        if (domain === this.$t('select_all')) {
          this.$store.commit('setDomainSelected', 'all')
        } else {
          this.$store.commit('setDomainSelected', domain)
        }
        this.$store.commit('setDataSource', type)
        this.$store.commit('toggleDomainChanged')
        this.placeholder = this.getPlaceholderPrefix(type) + domain
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
