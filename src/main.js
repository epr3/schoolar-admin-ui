import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createProvider } from './plugins/vue-apollo';
import './registerServiceWorker';
import './plugins/portal-vue';

import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider: createProvider(),
  store,
  render: h => h(App)
}).$mount('#app');
