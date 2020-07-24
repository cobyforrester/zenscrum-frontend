import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export const MyNavbar = () => {
  const authState = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/login">
          Scrummy
        </Link>

        <div className="ml-auto" id="navbarText">
          <ul className="navbar-nav mr-auto"></ul>
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
              <Link className="nav-item mr-5" to="/">
                Logout
              </Link>
            ) : null}
          </span>
        </div>
      </nav>
    </>
  );
};

export default MyNavbar;
