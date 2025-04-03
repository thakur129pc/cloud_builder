/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';
import { Task } from '../../../types/TaskTypes';
import { updateLoadingState } from '../../../redux/wizardSlice';

const AiCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const taskId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');

  const intialTaskState = {
    task_name: '',
    task_group_id: 10,
    task_description: '',
    task_options: [
      {
        name: '',
        description: '',
      },
    ],
  };
  const [taskState, setTaskState] = useState<Task>(intialTaskState);
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  const fetchTasks = async () => {
    try {
      dispatch(updateLoadingState(true));
      // API to be updated
      const response = await axios.get(
        API.API_CB + `admin/task-group/10/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const data = await response?.data?.data;
      setTaskState(data);
      dispatch(updateLoadingState(false));
    } catch (error) {
      setTaskState({ ...intialTaskState });
      dispatch(updateLoadingState(false));
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTasks();
    }
  }, [taskId]);

  const handleSave = async () => {
    try {
      if (!taskState.task_name.trim()) {
        toast.error('Task name is required');
        return;
      }
      if (!taskState.task_group_id) {
        toast.error('Task group name is required');
        return;
      }
      if (!taskState.task_description.trim()) {
        toast.error('Task description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/task',
        { ...taskState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      setTaskState(intialTaskState);
      navigate('/task');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the task'
      );
    }
  };

  const handleUpdate = async () => {
    try {
      if (!taskState.task_name.trim()) {
        toast.error('Task name is required');
        return;
      }
      if (!taskState.task_group_id) {
        toast.error('Task group name is required');
        return;
      }
      if (!taskState.task_description.trim()) {
        toast.error('Task description is required');
        return;
      }
      const response = await axios.put(
        API.API_CB + `admin/task/${taskId}`,
        { ...taskState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      setTaskState(intialTaskState);
      navigate('/task');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the task'
      );
    }
  };

  const addOption = () => {
    setTaskState({
      ...taskState,
      task_options: [
        ...(taskState?.task_options || []),
        {
          name: '',
          description: '',
        },
      ],
    });
  };

  const removeOption = (index: number) => {
    const updatedAttributes = [...(taskState.task_options || [])];
    updatedAttributes.splice(index, 1);
    setTaskState({
      ...taskState,
      task_options: updatedAttributes,
    });
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
              Infrastructure Type Create
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
            </ul>
          </div>
        </nav>
      </header>
      <Sidebar />
      <section className="dashboard-main">
        <div className="content-wrapper">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                INFRASTUCTURE TYPE DETAILS
                <div className="pull-right">
                  {readOnly && !isEditing ? (
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="edit-module"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  ) : isEditing && readOnly ? (
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="save-btn"
                      onClick={() => {
                        if (taskId) {
                          handleUpdate();
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
            <div
              className="panel-body panel-collapse collapse in"
              aria-expanded="true"
            >
              <div className="row form-group">
                <div id="module-wrapper" className="col-sm-12">
                  <div className="module-outer">
                    <div className="row form-group">
                      <div className="col-sm-12">
                        <label className="labels">
                          Infrastructure Type Name:
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          name="test_name"
                          value={taskState.task_name}
                          onChange={(e) => {
                            setTaskState({
                              ...taskState,
                              task_name: e.target.value,
                            });
                          }}
                          data-parsley-error-message="Enter infrastructure type name"
                          placeholder="Enter infrastructure type name"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={1}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <label htmlFor="description" className="labels">
                          {' '}
                          Infrastructure Type Description:
                        </label>
                        <textarea
                          name="llm_type"
                          data-sentence-case="true"
                          value={taskState?.task_description ?? ''}
                          onChange={(e) => {
                            setTaskState({
                              ...taskState,
                              task_description: e.target.value,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          id="description"
                          data-parsley-error-message="Enter infrastructure type description"
                          placeholder="Enter infrastructure type description"
                          className="form-control"
                          maxLength={255}
                          style={{ resize: 'vertical' }}
                          rows={3}
                          data-parsley-trigger="keyup"
                          data-parsley-id={2}
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
                KEY ATTRIBUTES
                {!readOnly && (
                  <div className="pull-right">
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="add-metric-btn"
                      onClick={addOption}
                      disabled={readOnly}
                    >
                      {' '}
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
              {(taskState.task_options || []).map((item, index) => (
                <div
                  key={index}
                  className="row form-group"
                  style={{ position: 'relative' }}
                >
                  <div className="col-sm-4" style={{ paddingBottom: '8px' }}>
                    <label className="labels"> Key Name: </label>
                    <input
                      type="text"
                      name="name"
                      value={item.name || ''}
                      onChange={(e) => {
                        const updatedOptions = [
                          ...(taskState.task_options || []),
                        ];
                        updatedOptions[index].name = e.target.value;
                        setTaskState({
                          ...taskState,
                          task_options: updatedOptions,
                        });
                      }}
                      disabled={readOnly && !isEditing}
                      placeholder="Enter key name"
                      className="form-control"
                      maxLength={255}
                      data-parsley-id={4}
                    />
                  </div>
                  <div className="col-sm-12">
                    <label htmlFor="description" className="labels">
                      Key Description:
                    </label>
                    <textarea
                      name="description"
                      data-sentence-case="true"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedOptions = [
                          ...(taskState.task_options || []),
                        ];
                        updatedOptions[index].description = e.target.value;
                        setTaskState({
                          ...taskState,
                          task_options: updatedOptions,
                        });
                      }}
                      disabled={readOnly && !isEditing}
                      id="description"
                      data-parsley-error-message="Enter key description"
                      placeholder="Enter key description"
                      className="form-control"
                      maxLength={255}
                      style={{ resize: 'vertical' }}
                      rows={2}
                      data-parsley-trigger="keyup"
                      data-parsley-id={2}
                    />
                  </div>
                  {index > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        zIndex: '100',
                        fontWeight: 'bolder',
                      }}
                      onClick={() => removeOption(index)}
                      title="Remove"
                    >
                      &times; {/* Unicode for a cross symbol */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiCreate;
