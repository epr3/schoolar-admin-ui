import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (
      localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) &&
      localStorage.getItem(process.env.VUE_APP_REFRESH_TOKEN)
    ) {
      next();
    } else {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      });
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) === null) {
      next();
    } else {
      next({ name: 'home' });
    }
  }
});

export default router;
