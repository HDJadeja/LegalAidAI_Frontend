import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('loggedIn') === 'true') {
      navigate('/chat');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const csrfToken = Cookies.get('csrftoken');
      const formData = new FormData();
      formData.append('user', username);
      formData.append('password', password);
      const res = await axios.post(
        `${API_BASE_URL}/login/`,
        formData,
        { withCredentials: true, headers: { 'X-CSRFToken': csrfToken } }
      );
      if (res.status === 200) {
        sessionStorage.setItem('loggedIn', 'true');
        navigate('/chat');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ?? 'Login failed. Please try again.'
      );
    }
  };

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background:rgb(255, 255, 255);
          padding: 1rem;
        }
        .login-card {
          max-width: 380px;
          width: 100%;
          background: #fff;
          border-radius: .75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="login-container">
        <div className="card login-card p-4">
          <h4 className="text-center mb-4 fw-bold">Welcome Back</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingUsername"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <label htmlFor="floatingUsername">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
