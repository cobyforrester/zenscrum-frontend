import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { Provider as ReduxProvider } from "react-redux";

import store from "./store";

//alert options
const alertOptions = {
  timeout: 3500,
  position: "bottom center",
};

const appEl = document.getElementById("root");
if (appEl) {
  ReactDOM.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App />
        </AlertProvider>
      </ReduxProvider>
    </React.StrictMode>,
    appEl
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
