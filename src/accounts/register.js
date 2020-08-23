import React, { useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  if (tmpAuthState) {
    return <Redirect to="/" />;
  }

  const clickSubmit = (event) => {
    event.preventDefault();
    let password = refPassword.current.value;
    let user = {
      username: refUsername.current.value,
      first_name: refFN.current.value,
      last_name: refLN.current.value,
      email: refEmail.current.value,
      password: sha256(password),
    };

    let isUnicode = true;
    for (var i = 0, n = password.length; i < n; i++) {
      if (password.charCodeAt(i) > 255) {
        isUnicode = false;
      }
    }

    if (!isUnicode) {
      alert.show("Password must be unicode characters", { type: "error" });
    } else if (password.length < 2) {
      alert.show("No Field can be less than 1 character", {
        type: "error",
      });
    } else {
      setIsLoading(true);
      register(user, dispatch, alert, setIsLoading);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
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
          {!isLoading ? (
            <button
              onClick={clickSubmit}
              className="btn btn-secondary btn-block"
            >
              Sign Up
            </button>
          ) : (
            <button className="btn btn-secondary btn-block">
              <span className="spinner-border spinner-border-sm"></span>{" "}
              Loading...
            </button>
          )}
          <p className="forgot-password text-right">
            Already registered? <Link to="/login">Sign-in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
