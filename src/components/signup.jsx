import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      const csrfToken = Cookies.get('csrftoken');
      const form = new FormData();
      form.append('uname', username);
      form.append('password', password);

      const res = await axios.post(
        `${API_BASE_URL}/signup/`,
        form,
        { withCredentials: true, headers: { 'X-CSRFToken': csrfToken } }
      );
      if (res.status === 201) {
        sessionStorage.setItem('loggedIn', 'true');
        setInfo('Account created! Redirecting...');
        setTimeout(() => navigate('/chat'), 1000);
      } else if (res.status === 200) {
        setError('User already exists. Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error ?? 'Sign up failed. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          padding: 1rem;
        }
        .signup-card {
          max-width: 400px;
          width: 100%;
          background: #fff;
          border-radius: .75rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="signup-container">
        <div className="card signup-card p-4">
          <h4 className="text-center mb-4 fw-bold">Create Account</h4>
          <form onSubmit={handleSubmit} noValidate>
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

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {info && <div className="alert alert-success py-2">{info}</div>}

            <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
