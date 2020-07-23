import React from 'react';
import './App.css';

import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import {ProjectComponent} from './projects';




function App() {
  return (
    <Router>
  <div className="App">
      <div>
            <Switch>
              <Route exact path='/' component={ProjectComponent} />
            </Switch>
      </div>
  </div>
  </Router>
  );
}

export default App;
