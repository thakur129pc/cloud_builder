/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/API';
import {
  ApiErrorResponse,
  Group,
  RouteKeys,
  RouteMapping,
  SelectedOption,
} from '../../types/wizardTypes';
import { API } from '../../apiconfig';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../redux/store';
import SkeletonBox from '../components/SkeletonBox';
import { updateLoadingState } from '../../redux/wizardSlice';
import { toast } from 'react-toastify';

const LlmTypes: React.FC = () => {
  const [taskGroups, setTaskGroups] = useState<Group[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  const AuthState = useSelector((state: ReduxState) => state.AuthSlice);
  const dispatch = useDispatch<AppDispatch>();

  const routeMapping = {
    task_types: '/',
    toolkit: '/wizard/toolkit',
    team: '/wizard/toolkit',
    models: '/wizard/models',
    node: '/wizard/machines',
    level: '/wizard/mission',
    certifications: '/wizard/mission',
  };

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'task_types');
        const data = await response.data.data;
        setTaskGroups(data);
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data.message || 'Internal server error');
        setTaskGroups([]);
        dispatch(updateLoadingState(false));
      }
    };

    fetchTaskTypes();
  }, []);

  const findEmptyOrFirstOption = (
    data: SelectedOption[],
    routeMapping: RouteMapping
  ): RouteKeys | null => {
    const order = Object.keys(routeMapping);
    let lastMatchedOption: string | null = null;

    for (const item of data) {
      const { option_name, option_value } = item;
      if (typeof option_value === 'object' && option_value !== null) {
        for (const key in option_value) {
          if (
            Array.isArray(option_value[key]) &&
            option_value[key].length === 0
          ) {
            lastMatchedOption = option_name;
          } else if (
            option_value[key] &&
            typeof option_value[key] === 'object' &&
            Object.keys(option_value[key]).length === 0
          ) {
            lastMatchedOption = option_name;
          } else if (
            option_value[key] === null ||
            option_value[key] === undefined ||
            option_value[key] === ''
          ) {
            lastMatchedOption = option_name;
          }
        }
      }
    }

    if (lastMatchedOption) {
      return lastMatchedOption as RouteKeys;
    }

    // If no empty or false value found, return the last option_name in order defined by routeMapping
    for (const key of order) {
      if (data.some((item) => item.option_name === key)) {
        lastMatchedOption = key;
      }
    }

    return lastMatchedOption as RouteKeys; // Return the last matching option_name
  };

  useEffect(() => {
    if (WizardState.selectedOptions) {
      const lastMatchedPage = findEmptyOrFirstOption(
        WizardState.selectedOptions,
        routeMapping
      );
      if (lastMatchedPage !== null && AuthState.fromLogin) {
        const route = routeMapping[lastMatchedPage];
        navigate(route);
      }
    }
    const reduxLLm = WizardState.selectedLLMs;
    if (reduxLLm.length > 0) {
      setSelectedTypes(reduxLLm);
    }
  }, [WizardState]);

  const handleCheckboxChange = (value: number) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(value)) {
        return prevSelectedTypes.filter((type) => type !== value);
      } else {
        return [...prevSelectedTypes, value];
      }
    });
  };

  const handleNext = async () => {
    const intitalErrorState = { show: false, message: '' };
    try {
      if (selectedTypes.length == 0) {
        toast.error('Please Select LLM Task Type');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'task_types',
        { llm_capability_ids: [...selectedTypes] },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('this is result', result);
      setErrorState({ ...intitalErrorState });
      navigate('/wizard/toolkit');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('error', error);
      toast.error(
        error.response?.data.message || 'An error occurred. Please try again.'
      );
      setErrorState({
        show: true,
        message: error.response?.data.message || 'API error',
      });
    }
  };

  if (WizardState.loading) {
    return <SkeletonBox />;
  } else
    return (
      <section className="main-section">
        <div className="content-wrapper">
          <div className="panel panel-default main-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="wizard" id="myWizard">
                  {taskGroups?.length > 0 && (
                    <div className="step s1" id="llm-type-screen">
                      <div className="panel-heading">
                        <h4 className="panel-title">LLM Task Type</h4>
                      </div>
                      <div
                        className="panel-body panel-collapse collapse in"
                        aria-expanded="true"
                      >
                        {taskGroups?.map((group) => (
                          <React.Fragment key={group?.group_id}>
                            <div className="row">
                              <div className="col-sm-12">
                                <h4>{group?.group_name}</h4>
                              </div>
                            </div>
                            <div className="row form-group">
                              {group?.llm_capabilities?.map((type) => (
                                <div
                                  key={type?.llm_capability_id}
                                  className="col-sm-4 mb"
                                  onClick={() =>
                                    handleCheckboxChange(
                                      type?.llm_capability_id
                                    )
                                  }
                                >
                                  <div
                                    className={`card-border card-wrapper ${
                                      selectedTypes?.includes(
                                        type?.llm_capability_id
                                      )
                                        ? 'selected'
                                        : ''
                                    }`}
                                    data-type="text"
                                    data-value={type?.capability_name}
                                  >
                                    <div className="display-card">
                                      <div
                                        className={`color-strip color-${
                                          group?.group_id === 1
                                            ? 'blue'
                                            : 'green'
                                        }`}
                                      ></div>
                                      <div className="card-title d-flex">
                                        <h4>{type?.capability_name}</h4>
                                        <div className="checkbox c-checkbox custom-grid-select m0">
                                          <label>
                                            <input
                                              type="checkbox"
                                              className="channel-type custom-radio-select"
                                              name="text"
                                              value={type?.capability_name}
                                              checked={selectedTypes?.includes(
                                                type?.llm_capability_id
                                              )}
                                              onChange={() =>
                                                handleCheckboxChange(
                                                  type?.llm_capability_id
                                                )
                                              }
                                              data-parsley-multiple="text"
                                            />{' '}
                                            <span className="fa card-check"></span>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="card-content">
                                        <ul className="card-points triangle-list">
                                          {type?.llm_capability_options?.map(
                                            (option) => (
                                              <li key={option?.option_id}>
                                                {option?.option_name}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="card-footer">&nbsp;</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </React.Fragment>
                        ))}
                        {errorState?.show && (
                          <p style={{ color: 'red' }}>{errorState?.message}</p>
                        )}
                        <div className="row">
                          <div className="col-sm-12">
                            <input
                              type="hidden"
                              name="llm_text"
                              value={selectedTypes?.join(', ')}
                            />
                            <input type="hidden" name="llm_media" value="" />
                            <div className="pull-right">
                              <button
                                type="button"
                                className="btn btn-info btn-xs btn-tcenter"
                                data-action="llmType"
                                onClick={handleNext}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default LlmTypes;
