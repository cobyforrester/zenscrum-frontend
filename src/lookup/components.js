import axios from 'axios';
export const loadProjects = () => {
    return axios.get('http://127.0.0.1:8000/api/projects/')
    .then((response) => {
      return response
    })
    .catch(error => {
      return Promise.reject(error);
    });
}
