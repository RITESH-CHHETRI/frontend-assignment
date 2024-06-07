// src/reducers/userReducer.js
const initialState = {
    currentUser: null, // Initially, no user is logged in
    users: [], // An array to hold our registered users
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REGISTER_USER':
        // Registering a new user
        return {
         ...state,
          users: [...state.users, action.payload], // Add the new user to the users array
        };
      case 'LOGIN_USER':
        // Logging in a user
        return {
         ...state,
          currentUser: action.payload, // Update the current user
        };
      case 'LOGOUT_USER':
        // Logging out the current user
        return {
         ...state,
          currentUser: null, // Remove the current user
        };
      case 'UPDATE_USER':
        // Updating user details
        return {
         ...state,
          users: state.users.map(user =>
            user.id === action.payload.id? action.payload : user // Find and update the user
          ),
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  