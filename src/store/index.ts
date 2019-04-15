import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import UserModel from './modules/User/model';
import FacultyModel from './modules/Faculty/model';
import GroupModel from './modules/Group/model';
import SubjectModel from './modules/Subject/model';

import Auth from './modules/Auth';
import User from './modules/User';
import Faculty from './modules/Faculty';
import Group from './modules/Group';
import Subject from './modules/Subject';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();
database.register(UserModel);
database.register(FacultyModel);
database.register(GroupModel);
database.register(SubjectModel);

export default new Vuex.Store<{}>({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
      GroupModel.deleteAll();
      SubjectModel.deleteAll();
    },
    LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
      GroupModel.deleteAll();
      SubjectModel.deleteAll();
    }
  },
  actions: {},
  modules: {
    Auth,
    User,
    Faculty,
    Group,
    Subject
  },
  plugins: [VuexORM.install(database)]
});
