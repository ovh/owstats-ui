import Vue from 'vue'

// add translations directly to the application
Vue.i18n.add('en', require('./en.json'))
Vue.i18n.add('fr', require('./fr.json'))

// set the start locale to use
const userLanguage = ((navigator.languages && navigator.languages[0]) || '').substr(0, 2)
if (userLanguage === 'fr') {
  Vue.i18n.set('fr')
} else {
  Vue.i18n.set('en')
}

// set fallback for non-translated strings
Vue.i18n.fallback('en')
