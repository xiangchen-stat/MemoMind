import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});


export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
