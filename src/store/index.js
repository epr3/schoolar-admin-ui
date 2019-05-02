import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import UserModel from './modules/User/model';
import FacultyModel from './modules/Faculty/model';
import GroupModel from './modules/Group/model';
import SubjectModel from './modules/Subject/model';
import EventModel from './modules/Event/model';
import ProfessorModel from './modules/Professor/model';
import EventTypeModel from './modules/EventType/model';

import Auth from './modules/Auth';
import User from './modules/User';
import Faculty from './modules/Faculty';
import Group from './modules/Group';
import Subject from './modules/Subject';
import Event from './modules/Event';
import Professor from './modules/Professor';
import EventType from './modules/EventType';

import Modal from './modules/Modal';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();
database.register(UserModel);
database.register(FacultyModel);
database.register(GroupModel);
database.register(SubjectModel);
database.register(EventModel);
database.register(ProfessorModel);
database.register(EventTypeModel);

export default new Vuex.Store({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
      GroupModel.deleteAll();
      SubjectModel.deleteAll();
      EventModel.deleteAll();
      ProfessorModel.deleteAll();
      EventTypeModel.deleteAll();
    },
    LOGOUT() {
      UserModel.deleteAll();
      FacultyModel.deleteAll();
      GroupModel.deleteAll();
      SubjectModel.deleteAll();
      EventModel.deleteAll();
      ProfessorModel.deleteAll();
      EventTypeModel.deleteAll();
    }
  },
  actions: {},
  modules: {
    Auth,
    User,
    Faculty,
    Group,
    Subject,
    Event,
    Professor,
    EventType,
    Modal
  },
  plugins: [VuexORM.install(database)]
});
