import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { ProjectComponent } from "./projects";
import { Register, Login } from "./accounts";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={ProjectComponent} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
