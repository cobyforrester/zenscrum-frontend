import React, { useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { register } from "../actions";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import "./accounts.css";
import { sha256 } from "./sha256";

export const Register = () => {
  const tmpAuthState = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const alert = useAlert();
  const refFN = useRef();
  const refLN = useRef();
  const refUsername = useRef();
  const refEmail = useRef();
  const refPassword = useRef();

  if (tmpAuthState) {
    return <Redirect to="/" />;
  }

  const clickSubmit = () => {
    let user = {
      username: refUsername.current.value,
      first_name: refFN.current.value,
      last_name: refLN.current.value,
      email: refEmail.current.value,
      password: sha256(refPassword.current.value),
    };
    register(user, dispatch, alert);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={clickSubmit}>
          <h3>Sign Up</h3>

          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              ref={refFN}
              required={true}
              className="form-control"
              placeholder="First name"
            />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              ref={refLN}
              required={true}
              className="form-control"
              placeholder="Last name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              ref={refUsername}
              required={true}
              className="form-control"
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              ref={refEmail}
              required={true}
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              ref={refPassword}
              required={true}
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-secondary btn-block">
            Sign Up
          </button>
          <p className="forgot-password text-right">
            Already registered? <Link to="/login">Sign-in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
