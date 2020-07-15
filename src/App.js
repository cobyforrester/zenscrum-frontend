import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';


const loadProjects = () => {
  return axios.get('http://127.0.0.1:8000/api/projects/')
  .then((response) => {
    return response
  })
  .catch(error => {
    return Promise.reject(error);
  });
}

function App() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    loadProjects().then(response =>{
      if(response.status === 200){
        setProjects(response.data);
      }
    }).catch(error =>{
      console.log(error)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {projects.map((project, index) => {
            return <li>{project.title}</li>
          })}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
