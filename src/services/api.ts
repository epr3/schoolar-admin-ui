import axios from 'axios';

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

  const getFaculties = () => api.get('/faculties');
  const getFacultyById = (id: string) => api.get(`/faculties/${id}`);
  const postFaculty = (facultyObj: object) => api.post('/faculties', facultyObj);
  const updateFaculty = (id: string, facultyObj: object) => api.put(`/faculties/${id}`, facultyObj);
  const deleteFaculty = (id: string) => api.delete(`/faculties/${id}`);

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
    error => {
      // Do something with response error
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
    deleteFaculty
  };
};

export default create;
