import { createStore } from "redux";
import rootReducer from "./reducers";

let date = new Date();
let new_time = date.getTime();
let old_time = localStorage.getItem("date");

let auth = {
  token: null,
  date: null,
  isAuthenticated: false,
  user: null,
};

if (old_time) {
  if (new_time - old_time < 36000000) {
    auth = {
      token: localStorage.getItem("token"),
      date: localStorage.getItem("date"),
      isAuthenticated: true,
      user: JSON.parse(localStorage.getItem("user")),
    };
  } else {
    localStorage.clear();
  }
}

let initialState = { auth: auth };

const store = createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //for viewing dev tools redux
);

export default store;
