/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse, GroupState } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';
import ConfirmationModal from '../../components/DomainModal';

const TaskTypeCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const [showModal, setShowModal] = useState(false);

  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );

  const intialTaskTypeState = {
    group_id: 0,
    group_name: '',
    group_description: '',
    llm_capabilities: [
      {
        llm_capability_id: 0,
        capability_name: '',
        llm_capability_options: [
          {
            option_id: 0,
            option_name: '',
          },
        ],
      },
    ],
  };
  const [taskTypeState, setTaskTypeState] =
    useState<GroupState>(intialTaskTypeState);

  const [isEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly && DashboardState.selectedTaskType) {
      const reduxTaskType = {
        group_id: DashboardState.selectedTaskType?.group_id || 0,
        group_name: DashboardState.selectedTaskType?.group_name || '',
        // take this from redux
        group_description: '',
        llm_capabilities:
          DashboardState.selectedTaskType.llm_capabilities.map((item) => ({
            llm_capability_id: item.llm_capability_id,
            capability_name: item.capability_name,
            llm_capability_options: item.llm_capability_options.map(
              (option) => ({
                option_id: option.option_id,
                option_name: option.option_name,
              })
            ),
          })) || [],
      };
      setTaskTypeState(reduxTaskType);
    } else {
      setTaskTypeState(intialTaskTypeState);
    }
  }, [DashboardState.selectedCertificate, location.pathname]);

  const handleSave = async () => {
    try {
      if (!taskTypeState.group_name.trim()) {
        toast.error('Toolkit name is required');
        return;
      }
      if (!taskTypeState.group_description.trim()) {
        toast.error('Toolkit description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/task_types',
        { ...taskTypeState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setTaskTypeState(intialTaskTypeState);
      navigate('/toolkit');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the task type'
      );
    }
  };

  const addLLMCapability = () => {
    setTaskTypeState({
      ...taskTypeState,
      llm_capabilities: [
        ...taskTypeState.llm_capabilities,
        {
          llm_capability_id: 0,
          capability_name: '',
          llm_capability_options: [
            {
              option_id: 0,
              option_name: '',
            },
          ],
        },
      ],
    });
  };

  const removeCapability = (index: number) => {
    const updatedAttributes = [...taskTypeState.llm_capabilities];
    updatedAttributes.splice(index, 1);
    setTaskTypeState({
      ...taskTypeState,
      llm_capabilities: updatedAttributes,
    });
  };

  const addCapabilityOption = (capabilityIndex: number) => {
    const updatedState = { ...taskTypeState };

    updatedState.llm_capabilities[capabilityIndex] = {
      ...updatedState.llm_capabilities[capabilityIndex],
      llm_capability_options: [
        ...updatedState.llm_capabilities[capabilityIndex]
          .llm_capability_options,
        {
          option_id: 0,
          option_name: '',
        },
      ],
    };

    setTaskTypeState(updatedState);
  };

  const removeCapabilityOption = (
    capabilityIndex: number,
    optionIndex: number
  ) => {
    const updatedState = { ...taskTypeState };

    updatedState.llm_capabilities[capabilityIndex] = {
      ...updatedState.llm_capabilities[capabilityIndex],
      llm_capability_options: updatedState.llm_capabilities[
        capabilityIndex
      ].llm_capability_options.filter((_, index) => index !== optionIndex),
    };

    setTaskTypeState(updatedState);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const callDeleteApi = async () => {
    try {
      const response = await axios.delete(
        API.API_CB + 'admin/task_types/' + modelId,
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      navigate('/tasktype');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while deleting the task type'
      );
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="wrapper dashboard-main">
      <header className="topnavbar-wrapper">
        {/* START Top Navbar*/}
        <nav role="navigation" className="navbar topnavbar">
          {/* START navbar header*/}
          <div className="user-section">
            <h2 className="logo-title">Rokket AI</h2>
          </div>
          <div className="sec-title">
            <h3 className="sec_title_tag" data-picklistid="">
              Task Type Create
            </h3>
          </div>
          <div className="navbar-header pull-right"></div>
          <div className="nav-wrapper">
            <ul className="nav navbar-nav">
              <li>
                <a
                  href="#"
                  data-toggle-state="aside-toggled"
                  data-no-persist="true"
                  className="visible-xs sidebar-toggle"
                >
                  <em className="fa fa-navicon" />{' '}
                </a>
              </li>
              {/* START User avatar toggle*/}
            </ul>
          </div>
          {/* END Nav wrapper*/}
        </nav>
        {/* END Top Navbar*/}
      </header>
      <Sidebar />
      <section className="dashboard-main">
        <div className="content-wrapper">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                TASK TYPE DETAILS
                <div className="pull-right">
                  {readOnly && !isEditing ? (
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="edit-module"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  ) : // <button
                  //   type="button"
                  //   className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                  //   id="edit-module"
                  //   onClick={() => setIsEditing(true)}
                  // >
                  //   Edit
                  // </button>
                  isEditing && readOnly ? (
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="save-btn"
                      onClick={() => {
                        if (modelId) {
                          () => {};
                        } else {
                          () => {};
                        }
                      }}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="save-btn"
                      onClick={handleSave}
                      disabled={readOnly}
                    >
                      Save
                    </button>
                  )}
                </div>
              </h4>
            </div>
            <ConfirmationModal
              open={showModal}
              onCloseModal={onCloseModal}
              title="Are you sure you want to delete this?"
              onButtonClick={callDeleteApi}
            />
            <div
              className="panel-body panel-collapse collapse in"
              aria-expanded="true"
            >
              <div className="row form-group">
                <div id="module-wrapper" className="col-sm-12">
                  <div className="module-outer">
                    <div className="row form-group">
                      <div className="col-sm-4">
                        <label className="labels"> Task Group Name: </label>
                        <input
                          type="text"
                          name="llm_name"
                          value={taskTypeState?.group_name ?? ''}
                          onChange={(e) => {
                            setTaskTypeState({
                              ...taskTypeState,
                              group_name: e.target.value,
                              isEditing,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          data-parsley-error-message="Enter model name"
                          placeholder="Enter model name, e.g, Mistral-7b-Instruct-v0.2"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={4}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="labels">
                          Task Group Description:
                        </label>
                        <input
                          type="text"
                          name="llm_name"
                          value={taskTypeState?.group_description ?? ''}
                          onChange={(e) => {
                            setTaskTypeState({
                              ...taskTypeState,
                              group_description: e.target.value,
                              isEditing,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          data-parsley-error-message="Enter model name"
                          placeholder="Enter model name, e.g, Mistral-7b-Instruct-v0.2"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                LLM Capabilities
                {!readOnly && (
                  <div className="pull-right">
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="add-metric-btn"
                      onClick={addLLMCapability}
                      disabled={readOnly}
                    >
                      Add{' '}
                    </button>
                  </div>
                )}
              </h4>
            </div>
            <div
              className="panel-body panel-collapse collapse in"
              aria-expanded="true"
            >
              {taskTypeState.llm_capabilities.map((item, index) => (
                <div className="flex col-sm-12 m-lg">
                  <div key={index} className="row form-group">
                    <div className="col-sm-8">
                      <label className="labels">Capability Name: </label>
                      <input
                        type="text"
                        name="name"
                        value={item.capability_name || ''}
                        onChange={(e) => {
                          const updatedCertifications = [
                            ...taskTypeState.llm_capabilities,
                          ];
                          updatedCertifications[index].capability_name =
                            e.target.value;
                          updatedCertifications[index].isEditing = isEditing;
                          setTaskTypeState({
                            ...taskTypeState,
                            llm_capabilities: updatedCertifications,
                          });
                        }}
                        disabled={readOnly && !isEditing}
                        placeholder="Enter name"
                        className="form-control"
                        maxLength={255}
                        data-parsley-id={4}
                      />
                    </div>

                    {index > 0 && (
                      <div className="col-sm-4">
                        <button onClick={() => removeCapability(index)}>
                          X
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="panel-heading">
                    <h4
                      className="panel-title"
                      style={{ paddingBottom: '10px', marginBottom: '10px' }}
                    >
                      LLM Capability Options
                      {!readOnly && (
                        <div className="pull-right">
                          <button
                            type="button"
                            className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                            id="add-metric-btn"
                            onClick={() => addCapabilityOption(index)}
                            disabled={readOnly}
                          >
                            Add{' '}
                          </button>
                        </div>
                      )}
                    </h4>

                    {item.llm_capability_options.map((option, oIndex) => (
                      <div key={oIndex} className="flex row">
                        <div className="flex col-sm-8 m-sm" key={oIndex}>
                          <label className="labels">Option Name: </label>
                          <input
                            type="text"
                            name="name"
                            value={option.option_name || ''}
                            onChange={(e) => {
                              const updatedOptions = [
                                ...taskTypeState.llm_capabilities[index]
                                  .llm_capability_options,
                              ];
                              updatedOptions[oIndex].option_name =
                                e.target.value;
                              setTaskTypeState({
                                ...taskTypeState,
                                llm_capabilities: [
                                  ...taskTypeState.llm_capabilities.slice(
                                    0,
                                    index
                                  ),
                                  {
                                    ...taskTypeState.llm_capabilities[index],
                                    llm_capability_options: updatedOptions,
                                  },
                                  ...taskTypeState.llm_capabilities.slice(
                                    index + 1
                                  ),
                                ],
                              });
                            }}
                            disabled={readOnly && !isEditing}
                            placeholder="name"
                            className="form-control"
                            maxLength={255}
                            data-parsley-id={4}
                          />
                        </div>
                        {oIndex > 0 && (
                          <div className="row">
                            <button
                              onClick={() =>
                                removeCapabilityOption(index, oIndex)
                              }
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskTypeCreate;
