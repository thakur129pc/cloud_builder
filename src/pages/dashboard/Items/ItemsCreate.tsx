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
import { ItemFormData } from '../../../types/ItemsTypes';

const ItemCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const modelId = location.pathname.split('/')[2] || '';
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');
  const [formData, setFormData] = useState({} as ItemFormData);
  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  // const updateToolkitOption = async (
  //   toolkitOptions: Partial<ToolkitState>,
  //   optionId: number
  // ) => {
  //   try {
  //     const response = await axios.put(
  //       API.API_CB + 'admin/toolkit/' + modelId + '/option' + optionId,
  //       {
  //         ...toolkitOptions,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authObj?.access_token}`,
  //         },
  //       }
  //     );
  //     const result = await response.data;
  //     console.log('result', result);
  //   } catch (err) {
  //     const error = err as AxiosError<ApiErrorResponse>;
  //     console.error('Error:', error);
  //     toast.error(
  //       error.response?.data.message ||
  //         'An error occurred while updating toolkit option'
  //     );
  //   }
  // };

  // const updateToolkit = async (toolkit: Partial<ToolkitState>) => {
  //   try {
  //     const response = await axios.put(
  //       API.API_CB + 'admin/toolkit/' + modelId,
  //       {
  //         ...toolkit,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authObj?.access_token}`,
  //         },
  //       }
  //     );
  //     const result = await response.data;
  //     console.log('result', result);
  //   } catch (err) {
  //     const error = err as AxiosError<ApiErrorResponse>;
  //     console.error('Error:', error);
  //     toast.error(
  //       error.response?.data.message ||
  //         'An error occurred while updating toolkit'
  //     );
  //   }
  // };

  // const handleUpdateFlow = async () => {
  //   if (toolkitState.isEditing) {
  //     const payload = {
  //       toolkit_name: toolkitState.toolkit_name,
  //       toolkit_description: toolkitState.toolkit_description,
  //     };
  //     await updateToolkit(payload);
  //   }
  //   // change here option id
  //   toolkitState.toolkit_options.forEach(async (toolkitOption, index) => {
  //     // here as well
  //     if (toolkitOption.isEditing) {
  //       await updateToolkitOption(toolkitOption, index);
  //     }
  //   });
  // };

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
              Item Create
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
              ITEM DETAILS
              <div className="pull-right">
                {!isEditing ? (
                  <button
                    type="button"
                    className="btn btn-info btn-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-info btn-xs"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </div>
            </h4>
          </div>
          <div className="panel-body">
            <div className="row">
              {/* Part Details */}
              <div className="col-sm-4">
                <label>Part ID</label>
                <input
                  type="text"
                  name="partId"
                  value={formData.partId}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="col-sm-4">
                <label>Part Name</label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={readOnly && !isEditing}
                />
              </div>
              <div className="col-sm-4">
                <label>Version</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={readOnly && !isEditing}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <label>Part Type</label>
                <input
                  type="text"
                  name="partType"
                  value={formData.partType}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={readOnly && !isEditing}
                />
              </div>
              <div className="col-sm-8">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={readOnly && !isEditing}
                />
              </div>
            </div>

            {/* Category */}
            <div className="row">
              <div className="col-sm-4">
                <label>Category</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="H/W"
                      checked={formData.category === 'H/W'}
                      onChange={handleInputChange}
                      disabled={readOnly && !isEditing}
                    />
                    H/W
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <input
                      type="radio"
                      name="category"
                      value="S/W"
                      checked={formData.category === 'S/W'}
                      onChange={handleInputChange}
                      disabled={readOnly && !isEditing}
                    />
                    S/W
                  </label>
                </div>
              </div>

              {formData.category == 'S/W' && (
                <>
                  <div className="col-sm-4">
                    <label>Source</label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label>License</label>
                    <input
                      type="text"
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </>
              )}
            </div>

            {formData.category == 'H/W' && (
              <>
                {/* Machine Details */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Machine Name</label>
                    <input
                      type="text"
                      name="machineName"
                      value={formData.machineName}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-8">
                    <label>Machine Description</label>
                    <textarea
                      name="machineDescription"
                      value={formData.machineDescription}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* CPU */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>CPU</label>
                    <input
                      type="number"
                      name="cpu"
                      value={formData.cpu}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>RAM</label>
                    <input
                      type="number"
                      name="ram"
                      value={formData.ram}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>RAM UOM</label>
                    <input
                      type="number"
                      name="ramUOM"
                      value={formData.ramUOM}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* GPU */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>No of GPUs</label>
                    <input
                      type="number"
                      name="noOfGPUs"
                      value={formData.noOfGPUs}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>GPU RAM Value</label>
                    <input
                      type="number"
                      name="gpuRamValue"
                      value={formData.gpuRamValue}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>GPU RAM UOM</label>
                    <input
                      type="number"
                      name="gpuRamUOM"
                      value={formData.gpuRamUOM}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* Rates */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Hourly Rate</label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Monthly Rate</label>
                    <input
                      type="number"
                      name="monthlyRate"
                      value={formData.monthlyRate}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Yearly Rate</label>
                    <input
                      type="number"
                      name="yearlyRate"
                      value={formData.yearlyRate}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>
              </>
            )}
            {formData.category == 'S/W' && (
              <>
                {/* Software */}
                {/* Language */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Language</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Package URL</label>
                    <input
                      type="text"
                      name="packageURL"
                      value={formData.packageURL}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label>Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* Model number */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Model Number</label>
                    <input
                      type="text"
                      name="modelNumber"
                      value={formData.modelNumber}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label>Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Measurement Unit */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Last Updated</label>
                    <input
                      type="date"
                      name="lastUpdated"
                      value={formData.lastUpdated || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label>Measurement Unit</label>
                    <input
                      type="text"
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Measurement Value</label>
                    <input
                      type="number"
                      name="measurementValue"
                      value={formData.measurementValue || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Cost</label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label>Currency</label>
                    <select
                      name="currency"
                      value={formData.currency || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    >
                      <option value="">Select Currency</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      {/* Add more currencies as needed */}
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <label>Procurement Date</label>
                    <input
                      type="date"
                      name="procurementDate"
                      value={formData.procurementDate || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* End of Life */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>End of Life</label>
                    <input
                      type="date"
                      name="endOfLife"
                      value={formData.endOfLife || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Compliance Standards</label>
                    <input
                      type="text"
                      name="complianceStandards"
                      value={formData.complianceStandards}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Security Patches</label>
                    <input
                      type="text"
                      name="securityPatches"
                      value={formData.securityPatches}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>

                {/* Last Patch */}
                <div className="row">
                  <div className="col-sm-4">
                    <label>Last Patch Date</label>
                    <input
                      type="date"
                      name="lastPatchDate"
                      value={formData.lastPatchDate || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                  <div className="col-sm-12">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={readOnly && !isEditing}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ItemCreate;
