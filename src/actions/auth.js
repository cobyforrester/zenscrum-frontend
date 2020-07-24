import axios from "axios";
import { lookup } from "../lookup";

// CHECK TOKEN & LOAD USER
export const isAuthenticated = (dispatch, token) => {
  // User Loading
  lookup("get", "auth/user/", {}, { Authorization: `Token ${token}` })
    .then((res) => {
      dispatch({
        type: "AUTH_SUCCESS",
        payload: res.data,
      });
    })
    .catch((err) => {
      //dispatch(err.response.data, err.response.status);
      dispatch({
        type: "AUTH_ERROR",
      });
    });
};

// LOGIN USER
export const login = (username, password, dispatch, alert) => {
  // Headers
  let headers = {
    "Content-Type": "application/json",
  };

  // Request Body
  const data = JSON.stringify({ username, password });

  lookup("post", "auth/login/", data, headers)
    .then((response) => {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
      alert.show(`Welcome Back, ${response.data.user.first_name}`, {
        type: "success",
      });
    })
    .catch((error) => {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.non_field_errors[0]
      ) {
        alert.show(error.response.data.non_field_errors[0], { type: "error" });
      } else {
        alert.show("There was an error logging in!", { type: "error" });
      }
      dispatch({
        type: "AUTH_ERROR",
      });
    });
};

// REGISTER USER
export const register = ({ username, password, email }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ username, email, password });

  axios
    .post("/api/auth/register", body, config)
    .then((res) => {
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch((err.response.data, err.response.status));
      dispatch({
        type: "REGISTER_FAIL",
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post("/api/auth/logout/", null, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: "CLEAR_LEADS" });
      dispatch({
        type: "LOGOUT_SUCCESS",
      });
    })
    .catch((err) => {
      dispatch((err.response.data, err.response.status));
    });
};

// Setup config with token - helper function
export const tokenConfig = (token) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
