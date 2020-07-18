import React from 'react';
import './App.css';


import {ProjectsList, ProjectsListAsTable} from './projects'


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div>
          <ProjectsListAsTable />
        </div>
    </div>
  );
}

export default App;
