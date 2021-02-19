import Vue from 'vue'
import Vuex from 'vuex'

import coachesModule from './modules/coaches/index.js';
import requestModule from './modules/requests/index.js';
import authModule from './modules/auth/index.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    coaches: coachesModule,
    requests: requestModule,
    auth: authModule
  }
})