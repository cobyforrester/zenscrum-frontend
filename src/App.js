import React, { useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { ProjectComponent } from "./projects";
import { Register, Login } from "./accounts";
import { Navbar } from "./base";

function App() {
  let state = useState((state) => state);
  let dispatch = useDispatch();
  //isAuthenticated(dispatch, useState);
  return (
    <Router>
      <div className="App">
        <div>
          <Navbar />
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
