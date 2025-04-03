/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { API } from '../../../apiconfig';
import { CertificateState } from '../../../types/DashboardTypes';

const CertificateCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');
  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );
  const intialCertificateState = {
    name: '',
    description: '',
    certifications: [{ name: '', description: '' }],
  };
  const [certificateState, setCertificateState] = useState<CertificateState>(
    intialCertificateState
  );
  const [isEditing, setIsEditing] = useState(false);
  const readOnly = location.pathname.split('/')[2] ? true : false;

  useEffect(() => {
    if (readOnly && DashboardState.selectedCertificate) {
      const reduxCertificate = {
        name: DashboardState.selectedCertificate?.certification_name || '',
        description: DashboardState.selectedCertificate?.description || '',
        certifications:
          DashboardState.selectedCertificate?.certification_features.map(
            (item) => ({ name: item, description: '' })
          ) || [],
      };
      setCertificateState(reduxCertificate);
    } else {
      setCertificateState(intialCertificateState);
    }
  }, [DashboardState.selectedCertificate, location.pathname]);

  const handleSave = async () => {
    try {
      if (!certificateState.name.trim()) {
        toast.error('Certificate name is required');
        return;
      }
      if (!certificateState.description.trim()) {
        toast.error('Description is required');
        return;
      }
      const response = await axios.post(
        API.API_CB + 'admin/certifications',
        { ...certificateState },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      setCertificateState(intialCertificateState);
      navigate('/certification');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the certificate'
      );
    }
  };

  const updateCompliance = async (certificate: Partial<CertificateState>) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/compliance-standard/' + modelId,
        {
          name: certificate.name,
          description: certificate.description,
        },
        {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        }
      );
      await response.data;
      navigate('/certification');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating compliance standard'
      );
    }
  };

  const updateCertificate = async (
    certificate: Partial<CertificateState>,
    id: number | string
  ) => {
    try {
      const response = await axios.put(
        API.API_CB +
          'admin/compliance-standard/' +
          modelId +
          '/certification/' +
          id,
        {
          name: certificate.name,
          description: certificate.description,
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
          'An error occurred while updating compliance certificate'
      );
    }
  };

  const handleUpdateFlow = async () => {
    if (certificateState.isEditing) {
      const payload = {
        name: certificateState.name,
        description: certificateState.description,
      };
      await updateCompliance(payload);
    }
    certificateState.certifications.forEach(async (certificate, index) => {
      if (certificate.isEditing) {
        await updateCertificate(certificate, index);
      }
    });
  };

  const addAttribute = () => {
    setCertificateState({
      ...certificateState,
      certifications: [
        ...certificateState.certifications,
        {
          name: '',
          description: '',
        },
      ],
    });
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = [...certificateState.certifications];
    updatedAttributes.splice(index, 1);
    setCertificateState({
      ...certificateState,
      certifications: updatedAttributes,
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
              Certification Level Create
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
              CERTIFICATION LEVEL DETAILS
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
                      <label className="labels"> Certification Name: </label>
                      <input
                        type="text"
                        name="llm_name"
                        value={certificateState?.name ?? ''}
                        onChange={(e) => {
                          setCertificateState({
                            ...certificateState,
                            name: e.target.value,
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
                        {' '}
                        Certification Description:{' '}
                      </label>
                      <input
                        type="text"
                        name="llm_name"
                        value={certificateState?.description ?? ''}
                        onChange={(e) => {
                          setCertificateState({
                            ...certificateState,
                            description: e.target.value,
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
              Attributes
              {!readOnly && (
                <div className="pull-right">
                  <button
                    type="button"
                    className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                    id="add-metric-btn"
                    onClick={addAttribute}
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
            {certificateState.certifications.map((item, index) => (
              <div key={index} className="row form-group">
                <div className="col-sm-4">
                  <label className="labels"> Key Name: </label>
                  <input
                    type="text"
                    name="name"
                    value={item.name || ''}
                    onChange={(e) => {
                      const updatedCertifications = [
                        ...certificateState.certifications,
                      ];
                      updatedCertifications[index].name = e.target.value;
                      updatedCertifications[index].isEditing = isEditing;
                      setCertificateState({
                        ...certificateState,
                        certifications: updatedCertifications,
                      });
                    }}
                    disabled={readOnly && !isEditing}
                    placeholder="Enter key name"
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
      </section>
    </div>
  );
};

export default CertificateCreate;
