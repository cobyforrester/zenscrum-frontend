import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../actions";

export const MyNavbar = () => {
  const authState = useSelector((state) => state.auth.isAuthenticated);
  const authToken = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const alert = useAlert();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/login">
          Scrummy
        </Link>

        <div className="ml-auto" id="navbarText">
          <span className="navbar-text">
            {!authState ? (
              <Link className="nav-item" to="/login">
                Login
              </Link>
            ) : null}
            {!authState ? (
              <Link className="nav-item ml-3 mr-5" to="/register">
                Register
              </Link>
            ) : null}
            {authState ? (
              <button
                onClick={() => {
                  logout(dispatch, authToken, alert);
                }}
                type="button"
                className="logout-btn btn btn-outline-danger btn-rounded font-weight-bold"
              >
                Logout {authUser.username}
              </button>
            ) : null}
          </span>
        </div>
      </nav>
    </>
  );
};

export default MyNavbar;
