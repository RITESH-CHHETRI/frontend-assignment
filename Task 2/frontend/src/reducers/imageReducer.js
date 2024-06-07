// src/reducers/imageReducer.js
const initialState = {
    images: [], // An array to hold our images
  };
  
  const imageReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_IMAGE':
        return {
         ...state,
          images: [...state.images, action.payload],
        };
      case 'REMOVE_IMAGE':
        return {
         ...state,
          images: state.images.filter(image => image.id!== action.payload),
        };
      case 'UPDATE_IMAGE':
        return {
         ...state,
          images: state.images.map(image =>
            image.id === action.payload.id? action.payload : image
          ),
        };
      default:
        return state;
    }
  };
  
  export default imageReducer;
  