import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use(req => {
  const user = localStorage.getItem('dreamUser');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const generateStory = (data)  => API.post('/story/generate', data);
export const saveStory     = (data)  => API.post('/story/save', data);
export const getStories    = ()      => API.get('/story/list');
export const toggleFav     = (id)    => API.patch(`/story/${id}/favourite`);
export const deleteStory   = (id)    => API.delete(`/story/${id}`);
