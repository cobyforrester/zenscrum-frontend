import React, { useEffect, useState, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../actions";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import "./accounts.css";

export const Register = () => {
  let initialState = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  };
  const [state, setState] = useState(initialState);
  const tmpAuthState = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (tmpAuthState) {
      return <Redirect to="/" />;
    }
  }, [tmpAuthState]);

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3>Sign Up</h3>

          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
            />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
          <p className="forgot-password text-right">
            Already registered <a href="#">sign in?</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
