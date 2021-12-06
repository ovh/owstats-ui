<template>
  <section
    ref="rootEl"
    class="faq"
  >
    <nav
      v-if="hasNavigation"
      class="faq_tab"
    >
      <div
        v-for="(category, i) in categories"
        :key="`category-${i}`"
        :class="generateCategoryClasses(category)"
        @click="makeActiveCategory(category, i)"
      >
        {{ $t('faq.' + category) }}
      </div>
    </nav>
    <div
      v-for="(item, i) in categoryItems"
      :key="`accordion-item-${i}`"
      class="accordeon-item"
    >
      <div @click="makeActive(i)">
        <div
          class="accordion-title collapse"
          data-toggle="collapse"
        >
          <i
            :class="[i === activeQuestionIndex ? 'oui-icon-chevron-up' : 'oui-icon-chevron-down', 'oui-icon oui-collapsible__toggle-icon']"
          />
          <span>{{ item.title }}</span>
        </div>
      </div>
      <collapse-transition>
        <div
          v-if="i === activeQuestionIndex"
          class="accordion-body"
        >
          <p v-bind="item">
            {{ item.value }}
          </p>
        </div>
      </collapse-transition>
    </div>
  </section>
</template>

<script>
import { CollapseTransition } from 'vue2-transitions'

export default {
  name: 'FaqAccordion',

  components: {
    CollapseTransition
  },

  props: {
    /**
     * Array of items
     * Object style {title: string, value: string, tab: string}
     */
    items: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      activeTab: '',
      activeQuestionIndex: null,
      showAccordion: true
    }
  },

  computed: {
    categories () {
      const uniqueCategories = this.items
        .map(item => item.category)
        .filter(
          (category, index, categories) =>
            categories.indexOf(category) === index
        )
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.activeTab = uniqueCategories[0]
      return uniqueCategories
    },
    categoryItems () {
      return this.items.filter(item => item.category === this.activeTab)
    },
    hasNavigation () {
      return !!this.categories[0]
    }
  },

  methods: {
    makeActive (itemIndex) {
      this.activeQuestionIndex =
        this.activeQuestionIndex === itemIndex ? null : itemIndex
      this.$emit('itemSelect', { itemIndex })
    },
    generateButtonClasses (buttonIndex) {
      return [
        'accordion-button',
        this.activeQuestionIndex === buttonIndex
          ? 'accordion-button_active'
          : null
      ]
    },
    generateQuestionClasses (questionIndex) {
      return [
        'accordion_title',
        this.activeQuestionIndex === questionIndex
          ? 'accordion_title_active'
          : null
      ]
    },
    makeActiveCategory (category, categoryIndex) {
      if (this.activeTab === category) return

      this.showAccordion = false
      this.activeTab = category
      this.activeQuestionIndex = null
      setTimeout(() => {
        this.$emit('categorySelect', { categoryIndex })
        this.showAccordion = true
      }, 300)
    },
    generateCategoryClasses (category) {
      return [
        'faq__nav-item',
        this.activeTab === category ? 'faq__nav-item_active' : null
      ]
    }
  }
}
</script>
