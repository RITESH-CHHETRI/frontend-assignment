// src/components/UserForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setErrorMessage(''); // Clear any existing error message
    setSuccessMessage(''); // Clear any existing success message

    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      console.log(response.data); // Log the entire response object
      setSuccessMessage('Registration successful. Check your email for further instructions.'); // Display success message
    } catch (error) {
      console.error(error); // Log the entire error object for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        setErrorMessage(error.response.data.message || 'An unknown error occurred.'); // Use a generic message if data.message is not available
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setErrorMessage('No response received from the server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
        setErrorMessage('An error occurred while trying to register.');
      }
    } finally {
      setLoading(false); // Reset loading state after operation completes
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
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
        <button type="submit" disabled={loading}>Register</button>
      </form>
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default UserForm;
