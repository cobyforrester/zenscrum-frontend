import axios from "axios";

export const lookup = (method, endpoint, data, headers) => {
  return axios({
    method: method,
    url: `https://scrummy-backend.herokuapp.com/api/${endpoint}`,
    data: data,
    headers: headers,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
