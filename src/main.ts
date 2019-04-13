import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  mounted() {
    store.dispatch('Auth/authCheck');
  },
  render: (h) => h(App),
}).$mount('#app');
