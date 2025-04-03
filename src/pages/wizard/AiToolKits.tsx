/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../apiconfig';
import { ApiErrorResponse, Toolkit } from '../../types/wizardTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../redux/store';
import SkeletonBox from '../components/SkeletonBox';
import { updateLoadingState, updateTeam } from '../../redux/wizardSlice';

import { toast } from 'react-toastify';
type OptionType = {
  [key: number]: boolean[];
};

const AiToolKits: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  const [toolKitData, setToolKitData] = useState<Toolkit[]>([]);
  const teamState = WizardState.selectedToolKits.teamState;
  const [selectedAi, setSelectedAi] = useState<number[]>(
    WizardState.selectedToolKits.ai || []
  );
  const [options, setOptions] = useState<OptionType>({});
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchAiData = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'toolkit');
        const data = await response.data.data;
        setToolKitData(data);
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data.message || 'Internal server error');
        setToolKitData([]);
        dispatch(updateLoadingState(false));
      }
    };

    fetchAiData();
  }, []);

  const handleCheckboxChange = (value: number | undefined) => {
    if (!value) {
      return;
    }
    setSelectedAi((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(value)) {
        return prevSelectedTypes.filter((type) => type !== value);
      } else {
        return [...prevSelectedTypes, value];
      }
    });
  };

  const handleOptions = (
    value: number | undefined,
    checked: boolean,
    index: number
  ) => {
    if (!value) {
      return;
    }
    const newOptions = { ...options };
    if (!newOptions[index]) {
      newOptions[index] = [checked];
    } else if (newOptions[index]) {
      if (checked) {
        newOptions[index].push(checked);
      } else {
        newOptions[index].pop();
      }
    }
    setOptions({ ...newOptions });
    setSelectedAi((prevSelectedTypes) => {
      return [...prevSelectedTypes, value];
    });
  };

  const handleNext = async () => {
    const intitalErrorState = { show: false, message: '' };

    const postToolkitOptions = async () => {
      const uniqSelectedAi = [...new Set([...selectedAi])];
      return await axios.post(
        `${API.API_CB}toolkit`,
        { toolkitoption_ids: [...uniqSelectedAi] },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
    };

    const postTeamData = async () => {
      return await axios.post(
        `${API.API_CB}infrastructure/team`,
        {
          data_scientists: Number(teamState.data_scientists),
          users: Number(teamState.users),
          workspace_os: teamState.workspace_os,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
    };

    try {
      if (
        selectedAi.length == 0 ||
        !teamState.users ||
        !teamState.data_scientists ||
        !teamState.workspace_os
      ) {
        toast.error('Please Select AI Tool Kits');
        return;
      }
      await Promise.all([postToolkitOptions(), postTeamData()]);
      navigate('/wizard/models');
      setErrorState({ ...intitalErrorState });
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('Unexpected error:', error);
      toast.error(
        error.response?.data.message || 'An error occurred. Please try again.'
      );
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newState = { ...WizardState.selectedToolKits.teamState };
    newState = { ...newState, [name]: value };
    dispatch(updateTeam(newState));
  };

  useEffect(() => {
    const reduxAiState = WizardState.selectedToolKits.ai;
    if (reduxAiState.length > 0) {
      setSelectedAi(reduxAiState);
    }
  }, [WizardState.selectedToolKits.ai]);

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
                  <div className="step s2" id="ai-tool-kit-screen">
                    <div className="panel-heading">
                      <h4 className="panel-title">AI Tool Kits</h4>
                    </div>
                    <div
                      className="panel-body panel-collapse collapse in custom-panel ai-check-outer"
                      aria-expanded="true"
                    >
                      <div className="row form-group">
                        {toolKitData?.map((item, tIndex) => (
                          <div
                            key={item?.toolkit_id}
                            className="col-sm-4"
                            onClick={() =>
                              handleCheckboxChange(item?.toolkit_id)
                            }
                          >
                            <div
                              className="card-border card-wrapper"
                              data-type="aitoolkit"
                              data-value="Guard Rails"
                            >
                              <div className="display-card">
                                <div className="color-strip color-blue"></div>
                                <div className="card-title d-flex">
                                  <h4>{item?.toolkit_name}</h4>
                                  <div className="checkbox c-checkbox custom-grid-select m0">
                                    <label>
                                      <input
                                        type="checkbox"
                                        className="channel-type custom-radio-select"
                                        name="aitoolkit"
                                        data-parsley-multiple="aitoolkit"
                                        data-parsley-id="14"
                                        checked={
                                          !!item?.toolkit_id &&
                                          selectedAi?.includes(item?.toolkit_id)
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(item?.toolkit_id)
                                        }
                                      />{' '}
                                      <span className="fa card-check"></span>
                                    </label>
                                  </div>
                                </div>
                                <div className="card-content">
                                  <ul className="card-points checkbox-list">
                                    {item?.toolkit_options?.map((option) => (
                                      <li key={option?.toolkitoption_id}>
                                        <div className="checkbox c-checkbox blue-checkbox card-checkbox">
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="guardrails[]"
                                              value="Obscenity"
                                              data-parsley-multiple="guardrails"
                                              data-parsley-id="17"
                                              onChange={(e) =>
                                                handleOptions(
                                                  item?.toolkit_id,
                                                  e?.target?.checked,
                                                  tIndex
                                                )
                                              }
                                            />
                                            <span className="fa card-check"></span>
                                            {option?.toolkitoption_name}
                                          </label>
                                        </div>
                                      </li>
                                    ))}

                                    <li>
                                      <div className="checkbox c-checkbox blue-checkbox card-checkbox">
                                        &nbsp;
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="card-footer">&nbsp;</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-4">
                          <div
                            className="card-border selected"
                            data-type="aitoolkit"
                            data-value="Chat bot"
                          >
                            <div className="display-card">
                              <div className="color-strip color-lgreen"></div>
                              <div className="card-title d-flex">
                                <h4>Team</h4>
                              </div>
                              <div className="card-content">
                                <ul className="card-points checkbox-list">
                                  <li>
                                    <label> AI Team size</label>
                                    <input
                                      type="text"
                                      name="data_scientists"
                                      value={teamState?.data_scientists}
                                      required
                                      data-connection-enable=""
                                      data-parsley-error-message="Enter number of data scientists"
                                      placeholder="Type here..."
                                      className="form-control"
                                      data-field-number="true"
                                      data-parsley-id="41"
                                      onChange={handleInput}
                                    />
                                  </li>
                                  <li>
                                    <label> Workspace </label>
                                    <div className="chosen-container chosen-container-single chosen-container-single-nosearch">
                                      <select
                                        className="chosen-single"
                                        value={teamState?.workspace_os}
                                        name="workspace_os"
                                        onChange={handleInput}
                                      >
                                        Choose WorkSpace
                                        <option value={''} disabled>
                                          Select OS
                                        </option>
                                        <option value={'windows'}>
                                          Windows
                                        </option>
                                        <option value={'linux'}>Linux</option>
                                      </select>
                                      {/* <div className="chosen-drop">
                                      <div className="chosen-search">
                                        <input type="text" />
                                      </div>
                                      <ul className="chosen-results"></ul>
                                    </div> */}
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="card-footer">&nbsp;</div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div
                            className="card-border selected"
                            data-type="aitoolkit"
                            data-value="Chat bot"
                          >
                            <div className="display-card">
                              <div className="color-strip color-lgreen"></div>
                              <div className="card-title d-flex">
                                <h4>Users</h4>
                              </div>
                              <div className="card-content">
                                <ul className="card-points checkbox-list">
                                  <li>
                                    <label> Number of users</label>
                                    <input
                                      type="text"
                                      name="users"
                                      value={teamState?.users}
                                      data-connection-enable=""
                                      data-parsley-error-message="Enter number of data scientists"
                                      placeholder="Type here..."
                                      className="form-control"
                                      data-field-number="true"
                                      data-parsley-id="45"
                                      onChange={handleInput}
                                    />
                                  </li>
                                  <li>
                                    <label> &nbsp; </label>
                                  </li>
                                  <li>
                                    <label> &nbsp; </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="card-footer">&nbsp;</div>
                          </div>
                        </div>
                      </div>

                      {errorState?.show && (
                        <p style={{ color: 'red' }}>{errorState?.message}</p>
                      )}
                      <div className="row">
                        <div className="col-sm-12">
                          <input
                            type="hidden"
                            name="llm_aitoolkit"
                            value="Chat bot"
                          />
                          <div className="pull-right">
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="prev"
                              data-prev-pageid="1"
                              onClick={() => navigate('/wizard/task_types')}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="aitoolkit"
                              onClick={handleNext}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default AiToolKits;
