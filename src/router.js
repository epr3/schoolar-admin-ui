import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  mode: 'history',
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
      path: '/event_types',
      name: 'eventTypes',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "eventTypes" */ './views/EventTypes.vue')
    },
    {
      path: '/faculties/:id/groups/:groupId/events',
      name: 'groupEvents',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "events" */ './views/Events.vue')
    },
    {
      path: '/faculties/:id/groups/:groupId/students',
      name: 'groupStudents',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "groupStudents" */ './views/StudentTab.vue')
    },
    {
      path: '/faculties/:id',
      name: 'facultyTabs',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "facultyTabs" */ './views/FacultyTabs.vue')
    },
    {
      path: '/professors',
      name: 'professors',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "professors" */ './views/Professors.vue')
    },
    {
      path: '/students',
      name: 'students',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "students" */ './views/Students.vue')
    },
    {
      path: '/holidays',
      name: 'holidays',
      meta: {
        auth: true
      },
      component: () =>
        import(/* webpackChunkName: "holidays" */ './views/Holidays.vue')
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
