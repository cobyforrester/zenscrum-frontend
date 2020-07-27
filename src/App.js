import React from "react";
import "./App.css";
import "./App.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { ProjectComponent } from "./projects";
import { SprintComponent } from "./sprints";
import { Register, Login } from "./accounts";
import { Navbar } from "./base";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={ProjectComponent} />
            <Route exact path="/sprints/:id" component={SprintComponent} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
