import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './Login.css'; // Import the CSS file


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
      const { accessToken } = response.data;
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', accessToken);
      console.log('Token set in local storage, navigating to home...');
  
      navigate('/jobcenter');
      console.log('Navigation should have occurred');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your username and password.');
    }
  };
  

  return (
    <div className="login-container" style={{background: 'linear-gradient(to bottom right, #00c6ff, #0072ff)'}}>
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{background: 'linear-gradient(to bottom right, #00c6ff, #0072ff)', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer'}}>Login</button>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;