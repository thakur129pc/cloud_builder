import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { API } from '../apiconfig';
import axios, { AxiosError } from 'axios';
import {
  ApiErrorResponse,
  RouteKeys,
  SelectedOption,
  WizardState,
} from '../types/wizardTypes';

const initialState: WizardState = {
  models: [],
  selectedOptions: [],
  compareModels: false,
  error: { show: false, message: '' },
  loading: true,
  selectedLLMs: [],
  selectedToolKits: {
    ai: [],
    teamState: { workspace_os: '', users: '', data_scientists: '' },
  },
  selectedMachines: [],
  selectedLevel: 0,
  selectedCert: 0,
  selectedDataSet: 1,
};

const WizardSlice = createSlice({
  name: 'wizardSlice',
  initialState,
  reducers: {
    updateModels(state, action) {
      return { ...state, models: action.payload };
    },
    updateCompareModels(state, action) {
      return { ...state, compareModels: action.payload };
    },
    updateAI(state, action) {
      const newState = { ...state };
      newState['selectedToolKits'] = { ...newState['selectedToolKits'] };
      newState['selectedToolKits']['ai'] = [...action.payload];
      return { ...newState };
    },
    updateDataSet(state, action) {
      const newState = { ...state };
      newState.selectedDataSet = action.payload;
      return { ...newState };
    },
    updateTeam(state, action) {
      const newState = { ...state };
      newState['selectedToolKits'] = { ...newState['selectedToolKits'] };
      newState['selectedToolKits']['teamState'] = {
        ...newState['selectedToolKits']['teamState'],
        ...action.payload,
      };
      return { ...newState };
    },
    updateTask(state, action) {
      const newState = { ...state };
      newState['selectedLLMs'] = [
        ...newState['selectedLLMs'],
        ...action.payload,
      ];
      return newState;
    },
    updateMachines(state, action) {
      const newState = { ...state };
      newState['selectedMachines'] = [...action.payload];
      return newState;
    },
    updateSelectedOptions(state, action) {
      return { ...state, selectedOptions: action.payload };
    },
    updateLevel(state, action) {
      return { ...state, selectedLevel: action.payload };
    },
    updateCertificate(state, action) {
      return { ...state, selectedCert: action.payload };
    },
    updateLoadingState(state, action) {
      return { ...state, loading: action.payload };
    },
    updateErrorState(state, action) {
      const { show, message } = action.payload;
      const newState = { ...state };
      newState.error = { ...newState.error };
      newState.error.show = show;
      newState.error.message = message;
      return { ...newState };
    },
    initialErrorState(state) {
      return { ...state, error: initialState.error };
    },
  },
});

export const {
  updateModels,
  updateSelectedOptions,
  updateLoadingState,
  initialErrorState,
  updateErrorState,
  updateTeam,
  updateAI,
  updateCompareModels,
  updateMachines,
  updateCertificate,
  updateLevel,
  updateTask,
  updateDataSet,
} = WizardSlice.actions;

export default WizardSlice.reducer;

export function fetchUserSelectedOptions(access_token: string) {
  return async function userSelectionThunk(dispatch: Dispatch) {
    try {
      dispatch(updateLoadingState(true));
      const response = await axios.get(
        API.API_CB + 'infrastructure/user-selected-options',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // const response = await axios.get(API.LOCAL_URL + "user-selected-options");
      const data: SelectedOption[] = await response.data.data;
      //   console.log("res", data);
      data.forEach((item) => {
        if (item.option_name == RouteKeys.MODELS) {
          dispatch(updateModels(item.option_value.llm_ids));
        }
        if (item.option_name == RouteKeys.NODE) {
          // machine
          dispatch(updateMachines(item.option_value.node_list));
        }
        if (item.option_name == RouteKeys.TASK_TYPES) {
          dispatch(updateTask(item.option_value.llm_capability_ids));
        }
        if (item.option_name == RouteKeys.TEAM) {
          dispatch(updateTeam(item.option_value));
        }
        if (item.option_name == RouteKeys.TOOLKIT) {
          dispatch(updateAI(item.option_value.toolkitoption_ids));
        }
        if (item.option_name == RouteKeys.LEVEL) {
          dispatch(updateLevel(item.option_value.level_id));
        }
        if (item.option_name == RouteKeys.CERTIFICATION) {
          dispatch(updateCertificate(item.option_value.compliance_id));
        }
      });
      dispatch(updateLoadingState(false));
      dispatch(updateSelectedOptions(data));
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('error ', error);
      dispatch(updateLoadingState(false));
      dispatch(
        updateErrorState({
          show: true,
          message: error.response?.data.message || 'API Error',
        })
      );
    }
  };
}
