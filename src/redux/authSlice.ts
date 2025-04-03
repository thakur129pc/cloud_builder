import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../types/AuthTypes';

const initialState: AuthState = {
  authLoading: false,
  authObj: null,
  email: '',
  fromLogin: false,
};

const AuthSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    updateAuth(state, action) {
      return { ...state, authObj: action.payload };
    },
    updateEmail(state, action) {
      return { ...state, email: action.payload };
    },
    updateFromLogin(state, action) {
      return { ...state, fromLogin: action.payload };
    },
  },
});

export const { updateAuth, updateEmail, updateFromLogin } = AuthSlice.actions;

export default AuthSlice.reducer;
