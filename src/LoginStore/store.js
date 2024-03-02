import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const preloadedState = {
  auth: {
      user: JSON.parse(localStorage.getItem('userData')),
      isLoggedIn: !!localStorage.getItem('userData'),
  },
};

// Create a Redux store and include the Auth slice reducer.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export default store;