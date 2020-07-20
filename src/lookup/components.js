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

export const loadProjects = () => {
    return lookup('get', 'projects/', {}, {})
}

export const actionMemberPost = (props) => {
  const { id, action, member } = props;
  let config = {
    headers: {}
  }
  let data = {
    id: id,
    action: action,
    member: member,
  }
  return axios.post('http://127.0.0.1:8000/api/projects/action/', data, config)
  .then((response) => {
    return response
  })
  .catch(error => {
    return Promise.reject(error);
  });
}