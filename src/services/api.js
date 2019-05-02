import axios from 'axios';
import router from '../router';
import store from '../store';

const create = () => {
  const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const postLogin = loginObj => api.post('/login', loginObj);
  const getProfile = () => api.get('/profile');
  const deleteLogout = () => api.delete('/logout');

  const getProfessors = () => api.get('/professors');
  const postProfessor = professorObj => api.post('/professors', professorObj);
  const deleteProfessor = id => api.delete(`/professors/${id}`);
  const updateProfessor = (id, professorObj) =>
    api.put(`/professors/${id}`, professorObj);

  const getFaculties = () => api.get('/faculties');
  const getFacultyById = id => api.get(`/faculties/${id}`);
  const postFaculty = facultyObj => api.post('/faculties', facultyObj);
  const updateFaculty = (id, facultyObj) =>
    api.put(`/faculties/${id}`, facultyObj);
  const deleteFaculty = id => api.delete(`/faculties/${id}`);

  const getGroupById = id => api.get(`/groups/${id}`);
  const getGroupsByFacultyId = id => api.get(`/faculties/${id}/groups`);
  const getSubjectsByFacultyId = id => api.get(`/faculties/${id}/subjects`);
  const getEventsByGroupId = id => api.get(`/groups/${id}/events`);

  const postEvent = eventObj => api.post('/events', eventObj);
  const updateEvent = (id, eventObj) => api.put(`/events/${id}`, eventObj);
  const deleteEvent = id => api.delete(`/events/${id}`);

  const postGroup = groupObj => api.post('/groups', groupObj);
  const updateGroup = (id, groupObj) => api.put(`/groups/${id}`, groupObj);
  const deleteGroup = id => api.delete(`/groups/${id}`);

  const postSubject = subjectObj => api.post('/subjects', subjectObj);
  const updateSubject = (id, subjectObj) =>
    api.put(`/subjects/${id}`, subjectObj);
  const deleteSubject = id => api.delete(`/subjects/${id}`);

  const getEventTypes = () => api.get('/event_types');
  const postEventType = eventTypeObj => api.post('/event_types', eventTypeObj);
  const updateEventType = (id, eventTypeObj) =>
    api.put(`/event_types/${id}`, eventTypeObj);
  const deleteEventType = id => api.delete(`/event_types/${id}`);

  api.interceptors.request.use(
    config => {
      if (config.url !== '/login') {
        const accessToken = localStorage.getItem(
          process.env.VUE_APP_ACCESS_TOKEN
        );
        config.headers.Authorization = `JWT ${accessToken}`;
      }
      return config;
    },
    error => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  api.interceptors.response.use(
    response => {
      // Do something with response data
      return response;
    },
    async error => {
      const status = error.response ? error.response.status : null;
      if (
        status === 401 &&
        error.config &&
        !error.config.__isRetryRequest &&
        !error.config.url.includes('/refresh')
      ) {
        const refreshToken = localStorage.getItem(
          process.env.VUE_APP_REFRESH_TOKEN
        );
        if (!refreshToken) {
          return Promise.reject(error);
        }
        try {
          const response = await api.post('/refresh', { refreshToken });
          localStorage.setItem(
            process.env.VUE_APP_ACCESS_TOKEN,
            response.data.accessToken
          );
          localStorage.setItem(
            process.env.VUE_APP_REFRESH_TOKEN,
            response.data.refreshToken
          );
          error.config.__isRetryRequest = true;
          return api(error.config);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      if (error.config.url.includes('/refresh')) {
        localStorage.removeItem(process.env.VUE_APP_ACCESS_TOKEN);
        localStorage.removeItem(process.env.VUE_APP_REFRESH_TOKEN);
        store.commit('LOGOUT');
        router.replace('/login');
      }
      return Promise.reject(error);
    }
  );

  return {
    postLogin,
    getProfile,
    deleteLogout,
    getFacultyById,
    getFaculties,
    postFaculty,
    updateFaculty,
    deleteFaculty,
    getGroupsByFacultyId,
    getSubjectsByFacultyId,
    postGroup,
    updateGroup,
    deleteGroup,
    postSubject,
    updateSubject,
    deleteSubject,
    postEvent,
    updateEvent,
    deleteEvent,
    getEventsByGroupId,
    getGroupById,
    getProfessors,
    postProfessor,
    updateProfessor,
    deleteProfessor,
    getEventTypes,
    postEventType,
    updateEventType,
    deleteEventType
  };
};

export default create;
