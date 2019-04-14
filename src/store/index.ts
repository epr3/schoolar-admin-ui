import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import UserModel from './modules/User/model';
import FacultyModel from './modules/Faculty/model';

import Auth from './modules/Auth';
import User from './modules/User';
import Faculty from './modules/Faculty';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();
database.register(UserModel);
database.register(FacultyModel);

export default new Vuex.Store<{}>({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
    },
    LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
    }
  },
  actions: {},
  modules: {
    Auth,
    User,
    Faculty
  },
  plugins: [VuexORM.install(database)]
});
