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

const AppCreate: React.FC = () => {
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
              Application Create
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
                ROKKET APPLICATION
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
                      <div className="col-sm-8">
                        <label className="labels"> Application Name: </label>
                        <input
                          type="text"
                          name="llm_name"
                          // value={}
                          // onChange={(e) => {}}
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          data-parsley-error-message="Enter application name"
                          placeholder="Enter application name, e.g, Guardrails"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={4}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-sm-12">
                        <label className="labels">Application Options:</label>
                      </div>
                      <div
                        className="col-sm-8"
                        style={{ paddingBottom: '12px' }}
                      >
                        <input
                          type="text"
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          name="option_1"
                          // value={}
                          // onChange={(e) => {}
                          data-parsley-error-message="Enter option"
                          placeholder="Enter option"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={2}
                        />
                      </div>
                      <div
                        className="col-sm-8"
                        style={{ paddingBottom: '12px' }}
                      >
                        <input
                          type="text"
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          name="option_2"
                          value={taskState.task_name}
                          onChange={(e) => {
                            setTaskState({
                              ...taskState,
                              task_name: e.target.value,
                            });
                          }}
                          data-parsley-error-message="Enter option"
                          placeholder="Enter option"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={3}
                        />
                      </div>
                      <div
                        className="col-sm-8"
                        style={{ paddingBottom: '12px' }}
                      >
                        <input
                          type="text"
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          name="option_3"
                          value={taskState.task_name}
                          onChange={(e) => {
                            setTaskState({
                              ...taskState,
                              task_name: e.target.value,
                            });
                          }}
                          data-parsley-error-message="Enter option"
                          placeholder="Enter option"
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
        </div>
      </section>
    </div>
  );
};

export default AppCreate;
