// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import { Autocomplete } from 'buefy'
import VueGlobalVar from 'vue-global-var'

import App from './App'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

import './i18n'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Autocomplete)

Vue.use(VueGlobalVar, {
  globals: {
    $geoJson: 'data/countries.geojson'
  }
})

sync(store, router)

router.afterEach((to, from) => {
  let queryToUpdate = false
  const query = {}

  if (from.query.start_date &&
    !to.query.start_date) {
    query.start_date = from.query.start_date
    query.end_date = from.query.end_date
    queryToUpdate = true
  }
  if (from.query.domain &&
    !to.query.domain) {
    query.domain = from.query.domain
    queryToUpdate = true
  }
  if (!query.domain) {
    query.domain = 'all'
  }

  if (queryToUpdate) {
    router.replace({
      path: to.path,
      query: query
    })
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
