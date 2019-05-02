import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: "history",
  routes: [
    {
      path: "/event_types",
      name: "eventTypes",
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "events" */ "./views/EventTypes.vue")
    },
    {
      path: "/groups/:id/events",
      name: "groupEvents",
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "events" */ "./views/Events.vue")
    },
    {
      path: "/faculties/:id",
      name: "facultyTabs",
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "facultyTabs" */ "./views/FacultyTabs.vue")
    },
    {
      path: "/accounts",
      name: "accounts",
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "accounts" */ "./views/Accounts.vue")
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        auth: true
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
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) === null) {
      next();
    } else {
      next({ name: "home" });
    }
  }
});

export default router;
