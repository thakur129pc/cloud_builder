import { createSlice } from '@reduxjs/toolkit';
import { DashboardState } from '../types/DashboardTypes.ts';

const initialState: DashboardState = {
  dashboardLoading: false,
  llmList: null,
  selectedInference: null,
  selectedInferenceMethod: null,
  selectedTestMachine: null,
  selectedTaskType: null,
  selectedCertificate: null,
  selectedToolkit: null,
};

const DashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState,
  reducers: {
    updateLoadingState(state, action) {
      return { ...state, dashboardLoading: action.payload };
    },
    updateLLMList(state, action) {
      return { ...state, llmList: action.payload };
    },
    updateSelectedLLMList(state, action) {
      return { ...state, selectedInference: action.payload };
    },
    updateSelectedInferenceMethod(state, action) {
      return { ...state, selectedInferenceMethod: action.payload };
    },
    updateSelectedTestMachine(state, action) {
      return { ...state, selectedTestMachine: action.payload };
    },
    updateSelectedCertificate(state, action) {
      return { ...state, selectedCertificate: action.payload };
    },
    updateSelectedToolkit(state, action) {
      return { ...state, selectedToolkit: action.payload };
    },
    updatedSelectedTaskType(state, action) {
      return { ...state, selectedTaskType: action.payload };
    },
  },
});

export const {
  updateLoadingState,
  updateLLMList,
  updateSelectedLLMList,
  updateSelectedInferenceMethod,
  updateSelectedTestMachine,
  updateSelectedCertificate,
  updateSelectedToolkit,
  updatedSelectedTaskType,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;
