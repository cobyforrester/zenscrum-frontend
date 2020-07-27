import React, { useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../actions";
import { useAlert } from "react-alert";
import { sha256 } from "./sha256";
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

  const clickSubmit = () => {
    login(
      refUsername.current.value,
      sha256(refPassword.current.value), //hashing password so it cannot be seen
      dispatch,
      alert
    );
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={clickSubmit}>
          <h3>Sign In</h3>
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

          <button type="submit" className="btn btn-secondary btn-block">
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
