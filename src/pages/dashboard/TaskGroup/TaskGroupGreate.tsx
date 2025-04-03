/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '.././Sidebar';
import { useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';
import { updateLoadingState } from '../../../redux/wizardSlice';

const TaskGroupCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groupId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');

  const initialTestGroupState = {
    group_name: '',
    group_description: '',
  };
  const [testTypeState, setTestTypeState] = useState<{
    group_name: string;
    group_description: string;
  }>(initialTestGroupState);
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  const handleSave = async () => {
    try {
      if (!testTypeState.group_name.trim()) {
        toast.error('Group name is required');
        return;
      }
      if (!testTypeState.group_description.trim()) {
        toast.error('Group description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/task-group',
        {
          group_name: testTypeState.group_name,
          group_description: testTypeState.group_description,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      setTestTypeState(initialTestGroupState);
      navigate('/taskgroup');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the task group'
      );
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      if (!testTypeState.group_name.trim()) {
        toast.error('Group name is required');
        return;
      }
      if (!testTypeState.group_description.trim()) {
        toast.error('Group description is required');
        return;
      }
      const response = await axios.put(
        API.API_CB + 'admin/task-group/' + id,
        {
          group_name: testTypeState.group_name,
          group_description: testTypeState.group_description,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      navigate('/taskgroup');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating task group'
      );
    }
  };

  useEffect(() => {
    const fetchTaskGroupDetails = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(
          API.API_CB + `admin/task-group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${authObj?.access_token}`,
            },
          }
        );
        const data = await response.data?.data;
        setTestTypeState(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        dispatch(updateLoadingState(false));
      }
    };
    if (groupId) {
      fetchTaskGroupDetails();
    }
  }, [groupId]);

  return (
    <div className="wrapper dashboard-main">
      <header className="topnavbar-wrapper">
        {/* Top Navbar*/}
        <nav role="navigation" className="navbar topnavbar">
          {/* Navbar Header*/}
          <div className="user-section">
            <h2 className="logo-title">Rokket AI</h2>
          </div>
          <div className="sec-title">
            <h3 className="sec_title_tag" data-picklistid="">
              Task Group Create
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
                TASK GROUP
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
                        if (groupId) {
                          handleUpdate(groupId);
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
            <div
              className="panel-body panel-collapse collapse in"
              aria-expanded="true"
            >
              <div className="row form-group">
                <div id="module-wrapper" className="col-sm-12">
                  <div className="module-outer">
                    <div className="row form-group">
                      <div className="col-sm-4">
                        <label className="labels"> Group Name: </label>
                        <input
                          type="text"
                          name="llm_name"
                          value={testTypeState?.group_name ?? ''}
                          onChange={(e) => {
                            setTestTypeState({
                              ...testTypeState,
                              group_name: e.target.value,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          data-parsley-error-message="Enter group name"
                          placeholder="Enter group name"
                          className="form-control"
                          maxLength={255}
                          data-parsley-id={4}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <label htmlFor="description" className="labels">
                          {' '}
                          Group Description:
                        </label>
                        <textarea
                          name="llm_type"
                          data-sentence-case="true"
                          value={testTypeState?.group_description ?? ''}
                          onChange={(e) => {
                            setTestTypeState({
                              ...testTypeState,
                              group_description: e.target.value,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          id="description"
                          data-parsley-error-message="Enter group description"
                          placeholder="Enter description"
                          className="form-control"
                          maxLength={255}
                          style={{ resize: 'vertical' }}
                          rows={3}
                          data-parsley-trigger="keyup"
                          data-parsley-id={6}
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

export default TaskGroupCreate;
