/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse, ToolkitState } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';

const AdminToolkitCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );

  const intialToolkitState = {
    toolkit_name: '',
    toolkit_description: '',
    toolkit_options: [
      { toolkitoption_name: '', toolkitoption_description: '' },
    ],
  };
  const [toolkitState, setToolkitState] =
    useState<ToolkitState>(intialToolkitState);

  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly && DashboardState.selectedToolkit) {
      const reduxToolkit = {
        toolkit_name: DashboardState.selectedToolkit?.toolkit_name || '',
        toolkit_description: '',
        toolkit_options:
          DashboardState.selectedToolkit.toolkit_options.map((item) => ({
            toolkitoption_name: item.toolkitoption_name,
            toolkitoption_description: '',
          })) || [],
      };
      setToolkitState(reduxToolkit);
    } else {
      setToolkitState(intialToolkitState);
    }
  }, [DashboardState.selectedCertificate, location.pathname]);

  const handleSave = async () => {
    try {
      if (!toolkitState.toolkit_name.trim()) {
        toast.error('Toolkit name is required');
        return;
      }
      if (!toolkitState.toolkit_description.trim()) {
        toast.error('Toolkit description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/toolkit',
        { ...toolkitState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setToolkitState(intialToolkitState);
      navigate('/toolkit');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the toolkit'
      );
    }
  };

  const updateToolkitOption = async (
    toolkitOptions: Partial<ToolkitState>,
    optionId: number
  ) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/toolkit/' + modelId + '/option' + optionId,
        {
          ...toolkitOptions,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
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
          'An error occurred while updating toolkit option'
      );
    }
  };

  const updateToolkit = async (toolkit: Partial<ToolkitState>) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/toolkit/' + modelId,
        {
          ...toolkit,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
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
          'An error occurred while updating toolkit'
      );
    }
  };

  const handleUpdateFlow = async () => {
    if (toolkitState.isEditing) {
      const payload = {
        toolkit_name: toolkitState.toolkit_name,
        toolkit_description: toolkitState.toolkit_description,
      };
      await updateToolkit(payload);
    }
    // change here option id
    toolkitState.toolkit_options.forEach(async (toolkitOption, index) => {
      // here as well
      if (toolkitOption.isEditing) {
        await updateToolkitOption(toolkitOption, index);
      }
    });
  };

  const addAttribute = () => {
    setToolkitState({
      ...toolkitState,
      toolkit_options: [
        ...toolkitState.toolkit_options,
        {
          toolkitoption_name: '',
          toolkitoption_description: '',
        },
      ],
    });
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = [...toolkitState.toolkit_options];
    updatedAttributes.splice(index, 1);
    setToolkitState({
      ...toolkitState,
      toolkit_options: updatedAttributes,
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
              Admin Toolkit Create
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
                ADMIN TOOLKIT DETAILS
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
                          handleUpdateFlow();
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
                        <label className="labels"> Toolkit Name: </label>
                        <input
                          type="text"
                          name="llm_name"
                          value={toolkitState?.toolkit_name ?? ''}
                          onChange={(e) => {
                            setToolkitState({
                              ...toolkitState,
                              toolkit_name: e.target.value,
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
                        <label className="labels">Toolkit Description:</label>
                        <input
                          type="text"
                          name="llm_name"
                          value={toolkitState?.toolkit_description ?? ''}
                          onChange={(e) => {
                            setToolkitState({
                              ...toolkitState,
                              toolkit_description: e.target.value,
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
                Toolkit Options
                {!readOnly && (
                  <div className="pull-right">
                    <button
                      type="button"
                      className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                      id="add-metric-btn"
                      onClick={addAttribute}
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
              {toolkitState.toolkit_options.map((item, index) => (
                <div key={index} className="row form-group">
                  <div className="col-sm-4">
                    <label className="labels"> Name: </label>
                    <input
                      type="text"
                      name="name"
                      value={item.toolkitoption_name || ''}
                      onChange={(e) => {
                        const updatedCertifications = [
                          ...toolkitState.toolkit_options,
                        ];
                        updatedCertifications[index].toolkitoption_name =
                          e.target.value;
                        updatedCertifications[index].isEditing = isEditing;
                        setToolkitState({
                          ...toolkitState,
                          toolkit_options: updatedCertifications,
                        });
                      }}
                      disabled={readOnly && !isEditing}
                      placeholder="Enter name"
                      className="form-control"
                      maxLength={255}
                      data-parsley-id={4}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="labels"> Description: </label>
                    <input
                      type="text"
                      name="name"
                      value={item.toolkitoption_description || ''}
                      onChange={(e) => {
                        const updatedCertifications = [
                          ...toolkitState.toolkit_options,
                        ];
                        updatedCertifications[index].toolkitoption_description =
                          e.target.value;
                        updatedCertifications[index].isEditing = isEditing;
                        setToolkitState({
                          ...toolkitState,
                          toolkit_options: updatedCertifications,
                        });
                      }}
                      disabled={readOnly && !isEditing}
                      placeholder="description"
                      className="form-control"
                      maxLength={255}
                      data-parsley-id={4}
                    />
                  </div>
                  {index > 0 && (
                    <div className="col-sm-4">
                      <button onClick={() => removeAttribute(index)}>X</button>
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

export default AdminToolkitCreate;
