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

  const postLogin = (loginObj: object) => api.post('/login', loginObj);
  const getProfile = () => api.get('/profile');
  const deleteLogout = () => api.delete('/logout');

  const getProfessors = () => api.get('/professors');
  const postProfessor = (professorObj: object) =>
    api.post('/professors', professorObj);
  const deleteProfessor = (id: string) => api.delete(`/professors/${id}`);
  const updateProfessor = (id: string, professorObj: object) =>
    api.put(`/professors/${id}`, professorObj);

  const getFaculties = () => api.get('/faculties');
  const getFacultyById = (id: string) => api.get(`/faculties/${id}`);
  const postFaculty = (facultyObj: object) =>
    api.post('/faculties', facultyObj);
  const updateFaculty = (id: string, facultyObj: object) =>
    api.put(`/faculties/${id}`, facultyObj);
  const deleteFaculty = (id: string) => api.delete(`/faculties/${id}`);

  const getGroupById = (id: string) => api.get(`/groups/${id}`);
  const getGroupsByFacultyId = (id: string) =>
    api.get(`/faculties/${id}/groups`);
  const getSubjectsByFacultyId = (id: string) =>
    api.get(`/faculties/${id}/subjects`);
  const getEventsByGroupId = (id: string) => api.get(`/groups/${id}/events`);

  const postEvent = (eventObj: object) => api.post('/events', eventObj);
  const updateEvent = (id: string, eventObj: object) =>
    api.put(`/events/${id}`, eventObj);
  const deleteEvent = (id: string) => api.delete(`/events/${id}`);

  const postGroup = (groupObj: object) => api.post('/groups', groupObj);
  const updateGroup = (id: string, groupObj: object) =>
    api.put(`/groups/${id}`, groupObj);
  const deleteGroup = (id: string) => api.delete(`/groups/${id}`);

  const postSubject = (subjectObj: object) => api.post('/subjects', subjectObj);
  const updateSubject = (id: string, subjectObj: object) =>
    api.put(`/subjects/${id}`, subjectObj);
  const deleteSubject = (id: string) => api.delete(`/subjects/${id}`);

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
    deleteProfessor
  };
};

export default create;
