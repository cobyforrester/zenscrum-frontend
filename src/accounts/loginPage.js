import React, { useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../actions";
import { useAlert } from "react-alert";
import "./accounts.css";

export const Login = () => {
  const tmpAuthState = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const alert = useAlert();
  const refUsername = useRef();
  const refPassword = useRef();

  if (tmpAuthState) {
    return <Redirect to="/" />;
  }

  const clickSubmit = (event) => {
    event.preventDefault();
    let password = refPassword.current.value;
    let isUnicode = true;
    for (var i = 0, n = password.length; i < n; i++) {
      if (password.charCodeAt(i) > 255) {
        isUnicode = false;
      }
    }

    if (!isUnicode) {
      alert.show("Password must be unicode characters!", { type: "error" });
    } else if (!password) {
      alert.show("No field can be blank", { type: "error" });
    } else {
      login(
        refUsername,
        refPassword, //hashing password so it cannot be seen
        dispatch,
        alert
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3 className="mb-0">Sign In</h3>
          <p className="text-center mt-0 mb-2">
            (Sign in may take a few seconds)
          </p>
          <div className="form-group">
            <label>Username</label>
            <input
              ref={refUsername}
              required={true}
              type="username"
              className="form-control"
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              ref={refPassword}
              required={true}
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <button onClick={clickSubmit} className="btn btn-secondary btn-block">
            Submit
          </button>
          <p className="forgot-password text-right">
            No account? <Link to="/register">Sign-up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
