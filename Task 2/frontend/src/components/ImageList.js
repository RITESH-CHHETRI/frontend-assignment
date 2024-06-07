// src/components/ImageList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch images from the backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        setImages(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Map over images and render them
  const renderImages = () => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <ul>
        {images.map((image) => (
          <li key={image.id}>{image.filename}</li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Image List</h2>
      {renderImages()}
    </div>
  );
};

export default ImageList;
