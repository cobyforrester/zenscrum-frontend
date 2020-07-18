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