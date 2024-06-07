// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './components/UserForm';
import ImageUploadForm from './components/ImageUploadForm';
import ImageList from './components/ImageList';
import { createStore, combineReducers } from 'redux';
import imageReducer from './reducers/imageReducer'; // Import your image reducer
import userReducer from './reducers/userReducer'; // Import your user reducer

// Combine reducers
const rootReducer = combineReducers({
  images: imageReducer,
  users: userReducer,
});

// Create Redux store
const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<UserForm />} />
          <Route path="/upload-image" element={<ImageUploadForm />} />
          <Route path="/images" element={<ImageList />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
