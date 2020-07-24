let date = new Date();
let new_time = date.getTime();
let old_time = localStorage.getItem("date");

let initialState = {
  token: null,
  date: null,
  isAuthenticated: false,
  user: null,
};

if (old_time) {
  if (new_time - old_time < 36000000) {
    initialState = {
      token: localStorage.getItem("token"),
      date: localStorage.getItem("date"),
      isAuthenticated: true,
      user: JSON.parse(localStorage.getItem("user")),
    };
  } else {
    localStorage.clear();
  }
}

export const isLoggedReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      let d = new Date();
      let date = d.getTime();
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("date", date);

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        date: date,
        token: action.payload.token,
      };

    case "REGISTER_SUCCESS":
      let d2 = new Date();
      let date2 = d2.getTime();
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("date", date2);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "AUTH_ERROR":
      localStorage.clear();
      return {
        ...state,
        token: null,
        date: null,
        user: null,
        isAuthenticated: false,
      };
    case "LOGOUT_SUCCESS":
      localStorage.clear();
      return {
        ...state,
        token: null,
        date: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default isLoggedReducer;
