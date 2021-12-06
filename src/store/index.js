import Vue from 'vue'
import Vuex from 'vuex'
import VuexI18n from 'vuex-i18n' // load vuex i18n module

import app from './app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app
  }
})

Vue.use(VuexI18n.plugin, store)

export default store
