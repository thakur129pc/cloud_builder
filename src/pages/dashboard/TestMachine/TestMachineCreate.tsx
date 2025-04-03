/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestMachine } from '../../../types/MachineTypes';
import Sidebar from '.././Sidebar';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';

const TestMachineCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );
  const initialMachineState = {
    name: '',
    description: '',
    test_machine_id: 0,
  };
  const [testMachineState, setTestMachineState] =
    useState<TestMachine>(initialMachineState);
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly && DashboardState.selectedTestMachine) {
      const reduxInferenceMethod = {
        name: DashboardState.selectedTestMachine?.name || '',
        description: DashboardState.selectedTestMachine?.description || '',
        test_machine_id:
          DashboardState.selectedTestMachine?.test_machine_id || 0,
      };
      setTestMachineState(reduxInferenceMethod);
    } else {
      setTestMachineState(initialMachineState);
    }
  }, [DashboardState.llmList, location.pathname]);

  const handleSave = async () => {
    try {
      if (!testMachineState.name.trim()) {
        toast.error('Model name is required');
        return;
      }
      if (!testMachineState.description.trim()) {
        toast.error('Description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/test-machine',
        { ...testMachineState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setTestMachineState(initialMachineState);
      navigate('/testmachine');
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
      if (!testMachineState.name.trim()) {
        toast.error('Model name is required');
        return;
      }
      if (!testMachineState.description.trim()) {
        toast.error('Description is required');
        return;
      }
      const response = await axios.put(
        API.API_CB + 'admin/test-machine/' + id,
        { ...testMachineState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      navigate('/testmachine');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating test machine'
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
              Test Machine Create
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
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
              TEST MACHINE
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
                      if (modelId) {
                        handleUpdateFlow(modelId);
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
                      <label className="labels"> Test Machine Name: </label>
                      <input
                        type="text"
                        name="llm_name"
                        value={testMachineState?.name ?? ''}
                        onChange={(e) => {
                          setTestMachineState({
                            ...testMachineState,
                            name: e.target.value,
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
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="description" className="labels">
                        {' '}
                        Description:
                      </label>
                      <textarea
                        name="llm_type"
                        data-sentence-case="true"
                        value={testMachineState?.description ?? ''}
                        onChange={(e) => {
                          setTestMachineState({
                            ...testMachineState,
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
      </section>
    </div>
  );
};

export default TestMachineCreate;
