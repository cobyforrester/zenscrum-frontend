import { lookup } from "../lookup";

// CHECK TOKEN & LOAD USER
export const isAuthenticated = (dispatch, token) => {
  let headers = { Authorization: `Token ${token}` };
  lookup("get", "auth/user/", {}, headers)
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
  if (!username || !password) {
    alert.show("Error no field can be empty", { type: "error" });
  } else {
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
          alert.show(error.response.data.non_field_errors[0], {
            type: "error",
          });
        } else {
          alert.show("There was an error logging in!", { type: "error" });
        }
        dispatch({
          type: "AUTH_ERROR",
        });
      });
  }
};

// REGISTER USER
export const register = (user, dispatch, alert) => {
  // Headers
  let headers = {
    "Content-Type": "application/json",
  };

  if (
    !user.first_name ||
    !user.last_name ||
    !user.username ||
    !user.email ||
    !user.password
  ) {
    alert.show("Error no field can be empty", { type: "error" });
  } else {
    // Request Body
    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      password: user.password,
    };

    lookup("post", "auth/register/", data, headers)
      .then((res) => {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: res.data,
        });
        alert.show(`Welcome to Scrummy ${user.first_name}!`, {
          type: "success",
        });
      })
      .catch((err) => {
        //console.log(err.response.data, err.response.data.email[0]);
        if (err && err.response && err.response.data) {
          if (err.response.data.email && err.response.data.email[0])
            alert.show(err.response.data.email[0], {
              type: "error",
            });
        }
      });
  }
};

// LOGOUT USER
export const logout = (dispatch, token, alert) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
  lookup("post", "auth/logout/", null, headers)
    .then((res) => {
      dispatch({
        type: "LOGOUT_SUCCESS",
      });
      alert.show("Come back sometime :)", { type: "success" });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: "LOGOUT_SUCCESS",
      });
      alert.show("Come back sometime :)", { type: "success" });
    });
};
