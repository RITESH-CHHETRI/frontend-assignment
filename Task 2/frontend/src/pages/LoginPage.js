import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom'; // Import Link for routing
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
    const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log(response.data);
      setSuccessMessage('Login successful. Welcome back!');
      localStorage.setItem('authToken', response.data.token);
        history('/images');
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'An unknown error occurred.');
      } else {
        setErrorMessage('An error occurred while trying to log in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{marginTop:30}}>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <br />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <Link to="/register">New User? Register Instead</Link> {/* Add Link to registration page */}
    </div>
  );
};

export default LoginPage;
