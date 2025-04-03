/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Sidebar from '.././Sidebar';
import { useState } from 'react';
import { API } from '../../../apiconfig';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { ReduxState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface InferenceState {
  name: string;
  description: string;
}

const InferenceMethodCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');

  const initialAttributeState = { name: '', description: '' };
  const [inferenceState, setInferenceState] = useState<InferenceState>(
    initialAttributeState
  );

  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );
  const [isEditing, setIsEditing] = useState(false);

  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly && DashboardState.selectedInferenceMethod) {
      const reduxInferenceMethod = {
        name: DashboardState.selectedInferenceMethod?.name || '',
        description: DashboardState.selectedInferenceMethod?.description || '',
      };
      setInferenceState(reduxInferenceMethod);
    } else {
      setInferenceState(initialAttributeState);
    }
  }, [DashboardState.llmList, location.pathname]);

  const handleSave = async () => {
    try {
      if (!inferenceState.name.trim()) {
        toast.error('Inference name is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/inference-method',
        { ...inferenceState },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setInferenceState(initialAttributeState);
      navigate('/inferencemethod');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the base model'
      );
    }
  };

  const handleUpdateMethod = async (id: string, model: InferenceState) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/llm/' + id,
        { ...model },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating the base model'
      );
    }
  };

  return (
    <div className="wrapper dashboard-main">
      {/* top navbar*/}
      <header className="topnavbar-wrapper">
        {/* START Top Navbar*/}
        <nav role="navigation" className="navbar topnavbar">
          {/* START navbar header*/}
          <div className="user-section">
            <h2 className="logo-title">Rokket AI</h2>
          </div>
          <div className="sec-title">
            <h3 className="sec_title_tag" data-picklistid="">
              {' '}
              Inference Method Create{' '}
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
      {/* sidebar*/}
      <Sidebar />
      <section className="dashboard-main">
        {/* Page content*/}
        <div className="content-wrapper">
          <form
            action=""
            data-parsley-validate=""
            id="app_form"
            name="app_form"
            autoComplete="off"
          >
            <input type="hidden" name="userId" />
            <input type="hidden" name="uuid" id="uuid" defaultValue="" />
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                  Inference Method Create
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
                            handleUpdateMethod(modelId, inferenceState);
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
                        <div className="col-sm-8">
                          <label className="labels">
                            {' '}
                            Inference Method Name:{' '}
                          </label>
                          <input
                            type="text"
                            name="llm_name"
                            value={inferenceState.name}
                            onChange={(e) => {
                              setInferenceState({
                                ...inferenceState,
                                name: e.target.value,
                              });
                            }}
                            disabled={readOnly && !isEditing}
                            data-sentence-case="true"
                            data-parsley-error-message="Enter model name"
                            placeholder="Enter inference method name, e.g, SmoothQuant"
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
          </form>
        </div>
      </section>
      {/* Page footer*/}
      {/* <footer>
        {" "}
        <span>© 2024 - Rokket AI</span>{" "}
      </footer> */}
    </div>
  );
};

export default InferenceMethodCreate;
