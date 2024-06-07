// src/components/ImageUploadForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addImage } from '../actions/imagesActions'; // Assuming you have an action defined for adding an image

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(`${file.size / 1024} KB`);
    setFileType(file.type.split('/')[1]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    // Validate file size and type here
    const maxSize = 16 * 1024 * 1024; // 16 MB
    const allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];

    if (selectedFile.size > maxSize ||!allowedTypes.includes(selectedFile.type.split('/')[1])) {
      alert("File size should be less than 16MB and supported formats are PNG, JPG, JPEG, GIF.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:5000/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the backend responds with the image ID upon success
      dispatch(addImage(response.data));
      setUploadStatus("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      setUploadStatus("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p>Selected File: {fileName}</p>
        <p>File Size: {fileSize}</p>
        <p>File Type: {fileType}</p>
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploadForm;
