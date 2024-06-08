// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import UserForm from './components/UserForm';
import LoginPage from './pages/LoginPage';
import ImageList from './components/ImageList'; // Make sure this import path is correct
import { createStore, combineReducers } from 'redux';
import imageReducer from './reducers/imageReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  images: imageReducer,
  users: userReducer,
});

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<UserForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/images" element={<ImageList />} /> {/* New route for ImageList */}
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
