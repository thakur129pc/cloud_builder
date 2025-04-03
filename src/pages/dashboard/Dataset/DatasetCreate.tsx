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
import { DatasetPayload } from '../../../types/DatasetTypes';

const DatasetCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';

  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const initialDataset = {
    data_name: '',
    file: '',
    description: '',
    storage_location: '',
    version: '',
  };
  const [dataset, setDatset] = useState<DatasetPayload>(initialDataset);

  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );
  const [isEditing, setIsEditing] = useState(false);

  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly) {
      //need to change here jsl
      // const baseModelRedux = {
      //   llm_name: DashboardState.llmList?.llm_family || '',
      //   llm_type: DashboardState.llmList?.llm_type || '',
      //   isEditing: false,
      // };
      // setDatset(baseModelRedux);
    } else {
      setDatset(initialDataset);
    }
  }, [DashboardState.llmList, location.pathname]); //need to change here jsl

  const handleSave = async () => {
    try {
      // Validate dataset
      if (!dataset.data_name.trim()) {
        toast.error('Model name is required');
        return;
      }
      if (!dataset.description.trim()) {
        toast.error('Model description is required');
        return;
      }

      // Validate attributeState

      const response = await axios.post(
        API.API_CB + 'admin/dataset',
        { ...dataset },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setDatset(initialDataset);
      navigate('/dataset');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the dataset'
      );
    }
  };

  const handleModelChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDatset((prevState) => ({
      ...prevState,
      isEditing,
      [name]: value,
    }));
  };

  const handleUpdateModel = async (id: string, model: DatasetPayload) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/dataset/' + id,
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
          'An error occurred while updating the dataset'
      );
    }
  };

  const handleUpdateFlow = async () => {
    await handleUpdateModel(modelId, dataset);
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
              Dataset Create{' '}
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
                  DATASET
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
                          <label className="labels"> Dataset Name: </label>
                          <input
                            type="text"
                            name="data_name"
                            value={dataset.data_name}
                            onChange={handleModelChange}
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
                          <label className="labels"> Upload File: </label>
                          <input
                            type="file"
                            name="file"
                            value={dataset.file}
                            onChange={handleModelChange}
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
                          <label className="labels"> Storage Location: </label>
                          <input
                            type="text"
                            name="storage_location"
                            value={dataset.storage_location}
                            onChange={handleModelChange}
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
                            name="description"
                            data-sentence-case="true"
                            value={dataset.description}
                            onChange={handleModelChange}
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

export default DatasetCreate;
