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

const TestTypeCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const testTypeId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');

  const initialMachineState = {
    test_type: '',
    description: '',
  };
  const [testTypeState, setTestTypeState] = useState<{
    test_type: string;
    description: string;
  }>(initialMachineState);
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  const handleSave = async () => {
    try {
      if (!testTypeState.test_type.trim()) {
        toast.error('Test Type Name is required');
        return;
      }
      if (!testTypeState.description.trim()) {
        toast.error('Description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/test-type',
        {
          name: testTypeState.test_type,
          description: testTypeState.description,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setTestTypeState(initialMachineState);
      navigate('/testtype');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the base model'
      );
    }
  };

  const handleUpdateFlow = async (id: string) => {
    try {
      if (!testTypeState.test_type.trim()) {
        toast.error('Test Type Name is required');
        return;
      }
      if (!testTypeState.description.trim()) {
        toast.error('Description is required');
        return;
      }
      const response = await axios.put(
        API.API_CB + 'admin/test-type/' + id,
        {
          name: testTypeState.test_type,
          description: testTypeState.description,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      navigate('/testtype');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating test machine'
      );
    }
  };

  useEffect(() => {
    const fetchTestTypeDetails = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(
          API.API_CB + `admin/test-type/${testTypeId}`,
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
    if (testTypeId) {
      fetchTestTypeDetails();
    }
  }, [testTypeId]);

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
              Test Type Create
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
                TEST TYPE
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
                        if (testTypeId) {
                          handleUpdateFlow(testTypeId);
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
                        <label className="labels"> Test Type Name: </label>
                        <input
                          type="text"
                          name="llm_name"
                          value={testTypeState?.test_type ?? ''}
                          onChange={(e) => {
                            setTestTypeState({
                              ...testTypeState,
                              test_type: e.target.value,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          data-sentence-case="true"
                          data-parsley-error-message="Enter model name"
                          placeholder="Enter test type name, e.g, Question & Answering"
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
                          Description:
                        </label>
                        <textarea
                          name="llm_type"
                          data-sentence-case="true"
                          value={testTypeState?.description ?? ''}
                          onChange={(e) => {
                            setTestTypeState({
                              ...testTypeState,
                              description: e.target.value,
                            });
                          }}
                          disabled={readOnly && !isEditing}
                          id="description"
                          data-parsley-error-message="Enter description"
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

export default TestTypeCreate;
