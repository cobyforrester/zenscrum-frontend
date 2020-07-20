import axios from 'axios';

export const lookup = (method, endpoint, data, headers) => {
  return axios({
    method: method,
    url: `http://127.0.0.1:8000/api/${endpoint}`,
    data: data,
    headers: headers,
  }).then((response) => {
    return response
  }).catch(error => {
    return Promise.reject(error);
  });
}
