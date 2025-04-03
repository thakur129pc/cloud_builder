import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import { AuthState } from '../types/AuthTypes';
import wizardSlice from './wizardSlice';
import { WizardState } from '../types/wizardTypes';
import dashboardSlice from './dashboardSlice';
import { DashboardState } from '../types/DashboardTypes';
export interface ReduxState {
  AuthSlice: AuthState;
  WizardSlice: WizardState;
  DashboardSlice: DashboardState;
}

const store = configureStore({
  reducer: {
    AuthSlice: authSlice,
    WizardSlice: wizardSlice,
    DashboardSlice: dashboardSlice,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
