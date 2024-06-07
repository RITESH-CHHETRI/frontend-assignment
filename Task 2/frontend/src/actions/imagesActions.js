// src/actions/imagesActions.js
export const ADD_IMAGE = 'ADD_IMAGE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const FETCH_IMAGES = 'FETCH_IMAGES';

export const addImage = (image) => ({
  type: ADD_IMAGE,
  payload: image,
});

export const removeImage = (imageId) => ({
  type: REMOVE_IMAGE,
  payload: imageId,
});

export const fetchImages = () => ({
  type: FETCH_IMAGES,
});
