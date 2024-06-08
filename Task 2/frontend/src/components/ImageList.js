import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImageList.css'; // Import the CSS file for styling
import { FaTrashAlt } from 'react-icons/fa'; // Import Font Awesome icon
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const history = useNavigate(); // Access history object for redirection

  // Function to fetch images from the backend
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/images', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setImages(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please log in again.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle file selection for upload
  const handleFileChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  // Function to upload an image
  const uploadImage = async (event) => {
    event.preventDefault();
    if (!uploadFile) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await axios.post('http://localhost:5000/images', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      alert(response.data.message);
      setUploadFile(null);
      fetchImages();
    } catch (err) {
      console.error(err);
      setError('Failed to upload image.');
    }
  };

  // Function to delete an image
  const deleteImage = async (imageId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      alert(response.data.message);
      fetchImages(); // Refresh the list of images
    } catch (err) {
      console.error(err);
      setError('Failed to delete image.');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the authToken from localStorage
    history('/login'); // Redirect to the login page
  };

  const renderContent = () => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <>
        <ul className="image-list">
          {images.map((image) => (
            <li key={image.id} className="image-card">
              <img src={`http://localhost:5000${image.url}`} alt={image.filename} className="image" />
              <button className="delete-button" onClick={() => deleteImage(image.id)}>
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
    <div className="container">

        <h2 className="heading">Image List</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
        <form onSubmit={uploadImage} encType="multipart/form-data" className="upload-form">
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload Image</button>
        </form>
        {renderContent()}
    </div>
);
};

export default ImageList;
