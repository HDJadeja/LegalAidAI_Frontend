import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    navigate('/login');
  };

  return (
    <div style={{ paddingTop: '70px' }} >
      <style>
        {`
          .floating-navbar {
            position: fixed;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 2rem);
            max-width: 980px;
            background: rgb(0, 0, 0);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 24px rgb(0, 0, 0);
            border-radius: 2rem;
            z-index: 1030;
          }
          .floating-navbar .navbar-toggler-icon {
            filter: invert(1);
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg floating-navbar navbar-dark">
        <div className="container-fluid px-3">
          <Link className="navbar-brand fw-bold fs-4" to="/">LegalAidAI</Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto align-items-center">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-outline-light btn-sm ms-lg-2" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm ms-lg-2"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
