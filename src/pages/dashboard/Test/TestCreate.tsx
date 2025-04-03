/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useState } from 'react';
import { API } from '../../../apiconfig';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatasetInfo } from '../../../types/DatasetTypes';
import { MetricState, TestType } from '../../../types/TestTypes';
import { updateLoadingState } from '../../../redux/wizardSlice';

interface FilteredUnit {
  name: string;
  value: number;
}
interface BaseTest {
  test_name: string;
  test_type_id?: string;
  description?: string;
  data_id: string;
  isEditing?: boolean;
}

const TestCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const testId = location.pathname.split('/')[2] || '';
  const [filteredUnits, setFilteredUnits] = useState<FilteredUnit[][]>([
    [{ name: '', value: 0 }],
  ]);
  const [datasetList, setDatasetList] = useState<DatasetInfo[]>([]);
  const [testTypeList, setTestTypeList] = useState<TestType[]>([]);
  const [measurementOptions, setMeasurementOptions] = useState<
    { measurement_type_id: string; type_name: number }[]
  >([]);
  const [uomOptions, setUOMOptions] = useState<
    { uom_id: string; uom_name: number; measurement_type_id: number }[]
  >([]);
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const initialTestModel = {
    test_name: '',
    description: '',
    test_type_id: '',
    data_id: '',
  };
  const [testModel, setTestModel] = useState<BaseTest>(initialTestModel);

  const initialAttributeState = [
    {
      metric_name: '',
      metric_description: '',
      is_measured: null,
    },
  ];
  const [merticState, setMetricState] = useState<MetricState[]>(
    initialAttributeState
  );

  const [isEditing, setIsEditing] = useState(false);

  const filterUnits = (measurementType: string | undefined) => {
    switch (measurementType) {
      case 'Parameters':
        return [{ name: 'Billions', value: 3 }];
      case 'Tokens':
        return [
          { name: 'Millions', value: 15 },
          { name: 'Thousands', value: 16 },
        ];
      case 'Model Size':
        return [
          { name: 'Mega bytes', value: 1 },
          { name: 'Giga bytes', value: 17 },
        ];
      case 'Latency':
        return [
          { name: 'Milliseconds', value: 18 },
          { name: 'Seconds', value: 19 },
        ];
      default:
        return [];
    }
  };

  const readOnly = location.pathname.split('/')[2] ? true : false;

  const handleSave = async () => {
    try {
      // Validate testModel
      if (!testModel.test_name.trim()) {
        toast.error('Test name is required');
        return;
      }
      if (!testModel.test_type_id?.trim()) {
        toast.error('Test Type is required');
        return;
      }
      if (!testModel.data_id.trim()) {
        toast.error('Dataset is required');
        return;
      }
      if (!testModel.description?.trim()) {
        toast.error('Description is required');
        return;
      }

      // Validate merticState
      for (let i = 0; i < merticState.length; i++) {
        const attribute = merticState[i];
        if (!attribute.metric_name.trim()) {
          toast.error(`Metric name is required for attribute ${i + 1}`);
          return;
        }
        if (!attribute.metric_description.trim()) {
          toast.error(`Metric description is required for attribute ${i + 1}`);
          return;
        }
        if (attribute.is_measured === null) {
          toast.error(`Measured status is required for attribute ${i + 1}`);
          return;
        }
        if (attribute.is_measured) {
          if (attribute.is_range === null) {
            toast.error(`Range status is required for attribute ${i + 1}`);
            return;
          }
          if (
            attribute.is_range === true &&
            (!attribute.min_range_value || !attribute.max_range_value)
          ) {
            toast.error(
              `Min & Max range value is required for attribute ${i + 1}`
            );
            return;
          }
          if (attribute.is_range === false && !attribute.fixed_range_value) {
            toast.error(`Fixed range value is required for attribute ${i + 1}`);
            return;
          }
          if (!attribute.uom_id || !attribute.uom_type) {
            toast.error(
              `Measurement type & UOM is required for attribute ${i + 1}`
            );
            return;
          }
        }
      }

      // Call multiple APIs in parallel
      // Call API for each metric and get IDs
      const metricResponses = await Promise.all(
        merticState.map(async (metric) => {
          try {
            const response = await axios.post(
              API.API_CB + 'admin/test-metric',
              metric, // Send metric data
              {
                headers: { Authorization: `Bearer ${authObj.access_token}` },
              }
            );

            // Validate and extract test_metric_id
            const testMetricId = response?.data?.data?.test_metric_id;
            if (!testMetricId) {
              throw new Error(
                `test_metric_id is missing for metric: ${metric.metric_name}`
              );
            }

            console.log(testMetricId, 'Extracted test_metric_id');
            return testMetricId; // Extract ID from response
          } catch (error) {
            console.error(`Error for metric: ${metric.metric_name}`, error);
            throw new Error(`Error for metric: ${metric.metric_name}`);
          }
        })
      );

      // If all API calls are successful, call the final API
      const finalResponse = await axios.post(
        API.API_CB + 'admin/test',
        { ...testModel, test_metrics_ids: metricResponses }, // Send collected IDs
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );

      if (finalResponse.data.status === 'success') {
        setTestModel({ test_name: '', data_id: '', isEditing: false });
        setMetricState([
          {
            metric_description: '',
            metric_name: '',
            uom_id: '',
            uom_type: '',
            is_range: null,
            is_measured: null,
          },
        ]);
        navigate('/testcomp');
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the test model'
      );
    }
  };

  const handleAttributeChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newAttributeState = [...merticState];
    if (isEditing) {
      newAttributeState[index].isEditing = isEditing;
    }
    if (field === 'is_measured') {
      newAttributeState[index].is_measured = value as boolean;
    } else if (field === 'uom_type') {
      newAttributeState[index].uom_type = value as string;
      newAttributeState[index].uom_id = ''; // Reset UOM when type changes
      const newFilteredUnits = [...filteredUnits];
      newFilteredUnits[index] = filterUnits(value as string);
      setFilteredUnits(newFilteredUnits);
    } else {
      // Handle changes for 'uom' and 'value' fields
      if (field === 'uom_id') {
        newAttributeState[index].uom_id = value as string;
      }
    }
    setMetricState(newAttributeState);
  };

  const addAttribute = () => {
    setMetricState([
      ...merticState,
      {
        metric_description: '',
        metric_name: '',
        uom_id: '',
        uom_type: '',
        is_range: null,
        is_measured: null,
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setMetricState(merticState.filter((_, i) => i !== index));
  };

  const handleUpdateFlow = async () => {
    try {
      // Validate testModel
      if (!testModel?.test_name?.trim()) {
        toast.error('Test name is required');
        return;
      }
      if (!testModel?.test_type_id) {
        toast.error('Test Type is required');
        return;
      }
      if (!testModel?.data_id?.trim()) {
        toast.error('Dataset is required');
        return;
      }
      if (!testModel?.description?.trim()) {
        toast.error('Description is required');
        return;
      }

      // Validate merticState
      for (let i = 0; i < merticState?.length; i++) {
        const attribute = merticState[i];
        if (!attribute?.metric_name?.trim()) {
          toast.error(`Metric name is required for attribute ${i + 1}`);
          return;
        }
        if (!attribute?.metric_description?.trim()) {
          toast.error(`Metric description is required for attribute ${i + 1}`);
          return;
        }
        if (attribute?.is_measured === null) {
          toast.error(`Measured status is required for attribute ${i + 1}`);
          return;
        }
        if (attribute.is_measured) {
          if (attribute?.is_range === null) {
            toast.error(`Range status is required for attribute ${i + 1}`);
            return;
          }
          if (
            attribute?.is_range === true &&
            (!attribute?.min_range_value || !attribute?.max_range_value)
          ) {
            toast.error(
              `Min & Max range value is required for attribute ${i + 1}`
            );
            return;
          }
          if (attribute?.is_range === false && !attribute?.fixed_range_value) {
            toast.error(`Fixed range value is required for attribute ${i + 1}`);
            return;
          }
          if (!attribute?.uom_id || !attribute?.uom_type) {
            toast.error(
              `Measurement type & UOM is required for attribute ${i + 1}`
            );
            return;
          }
        }
      }

      // Update all metrics first
      const metricResponses = await Promise.all(
        merticState.map(async (metric) => {
          try {
            if (metric.metric_id) {
              // Update existing metric
              const response = await axios.put(
                API.API_CB + `admin/test-metric/${metric.metric_id}`,
                metric,
                {
                  headers: { Authorization: `Bearer ${authObj.access_token}` },
                }
              );
              return response.data?.data?.test_metric_id;
            } else {
              // Create new metric
              const response = await axios.post(
                API.API_CB + 'admin/test-metric',
                metric,
                {
                  headers: { Authorization: `Bearer ${authObj.access_token}` },
                }
              );
              return response.data?.data?.test_metric_id;
            }
          } catch (error) {
            console.error(`Error for metric: ${metric.metric_name}`, error);
            throw new Error(`Error for metric: ${metric.metric_name}`);
          }
        })
      );

      // Update the test model
      const finalResponse = await axios.put(
        API.API_CB + `admin/test/${testId}`,
        { ...testModel, test_metrics_ids: metricResponses },
        {
          headers: { Authorization: `Bearer ${authObj.access_token}` },
        }
      );

      if (finalResponse.data.status === 'success') {
        toast.success('Test updated successfully');
        navigate('/testcomp');
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating the test model'
      );
    }
  };

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(API.API_CB + 'admin/dataset', {
        headers: { Authorization: `Bearer ${authObj.access_token}` },
      });
      // const response = await axios.get(API.LOCAL_URL + "dataset");
      const data = response?.data?.data;
      setDatasetList(data);
    } catch (error) {
      setDatasetList([]);
    }
  };

  const fetchTestTypes = async () => {
    try {
      const response = await axios.get(API.API_CB + 'admin/test-type', {
        headers: { Authorization: `Bearer ${authObj.access_token}` },
      });
      const data = response?.data?.data;
      setTestTypeList(data);
    } catch (error) {
      setTestTypeList([]);
    }
  };

  const fetchMeasurementTypes = async () => {
    try {
      const response = await axios.get(API.API_CB + 'admin/measurement-type', {
        headers: { Authorization: `Bearer ${authObj.access_token}` },
      });
      const data = response?.data?.data;
      setMeasurementOptions(data);
    } catch (error) {
      setMeasurementOptions([]);
    }
  };

  const fetchMeasurementUOM = async () => {
    try {
      const response = await axios.get(API.API_CB + 'admin/units-of-measure', {
        headers: { Authorization: `Bearer ${authObj.access_token}` },
      });
      const data = response?.data?.data;
      setUOMOptions(data);
    } catch (error) {
      setUOMOptions([]);
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchTestTypes();
    fetchMeasurementTypes();
    fetchMeasurementUOM();
  }, []);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(
          API.API_CB + `admin/test-detail/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${authObj?.access_token}`,
            },
          }
        );
        const data = response.data?.data;

        // Set testModel details
        setTestModel({
          test_name: data.test_name || '',
          description: data.test_description || '',
          test_type_id: data.test_type_id || '',
          data_id: data.data_id || '',
        });

        // Set metricState details
        const metrics = data.metrics.map((metric: MetricState) => ({
          metric_id: metric.metric_id,
          metric_name: metric.metric_name || '',
          metric_description: metric.metric_description || '',
          is_measured: metric.is_measured ? true : false,
          uom_id: metric.uom_id || undefined,
          uom_type: metric.uom_type || undefined,
          is_range: metric.is_range || undefined,
          fixed_range_value: metric.fixed_range_value || undefined,
          min_range_value: metric.min_range_value || undefined,
          max_range_value: metric.max_range_value || undefined,
        }));

        setMetricState(metrics);

        dispatch(updateLoadingState(false));
      } catch (error) {
        console.error('Error fetching test details:', error);
        dispatch(updateLoadingState(false));
      }
    };

    if (testId) {
      fetchTestDetails();
    }
  }, [testId]);

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
              Test Create{' '}
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
                  TEST
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
                          if (testId) {
                            handleUpdateFlow();
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
                        <div className="col-sm-2">
                          <label className="labels">Test Name:</label>
                        </div>
                        <div className="col-sm-6">
                          <input
                            type="text"
                            disabled={readOnly && !isEditing}
                            data-sentence-case="true"
                            name="test_name"
                            value={testModel.test_name}
                            onChange={(e) => {
                              setTestModel({
                                ...testModel,
                                test_name: e.target.value,
                              });
                            }}
                            data-parsley-error-message="Enter test name"
                            placeholder="Enter test name"
                            className="form-control"
                            maxLength={255}
                            data-parsley-id={1}
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-sm-2">
                          <label htmlFor="test_type" className="labels">
                            Test Type:
                          </label>
                        </div>
                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            id="test_type"
                            name="test_type"
                            disabled={readOnly && !isEditing}
                            value={testModel.test_type_id}
                            onChange={(e) => {
                              setTestModel({
                                ...testModel,
                                test_type_id: e.target.value,
                              });
                            }}
                          >
                            <option value="" disabled>
                              Select Test Type
                            </option>
                            {testTypeList.map((option) => (
                              <option
                                key={option.test_type_id}
                                value={option.test_type_id}
                              >
                                {option.test_type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-sm-2">
                          <label htmlFor="test_name" className="labels">
                            Dataset:
                          </label>
                        </div>
                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            id="test_name"
                            name="test_name"
                            disabled={readOnly && !isEditing}
                            value={testModel.data_id}
                            onChange={(e) => {
                              setTestModel({
                                ...testModel,
                                data_id: e.target.value,
                              });
                            }}
                          >
                            <option value="" disabled>
                              Select dataset
                            </option>
                            {datasetList.map((option) => (
                              <option
                                key={option.data_id}
                                value={option.data_id}
                              >
                                {option.data_name}
                              </option>
                            ))}
                          </select>
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
                            value={testModel?.description ?? ''}
                            onChange={(e) => {
                              setTestModel({
                                ...testModel,
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
                  TEST METRICS
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
                <div id="metrics-section">
                  {merticState?.map((attribute, index) => (
                    <div
                      key={index}
                      className="metrics-wrapper form-group"
                      style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        position: 'relative',
                      }}
                    >
                      {index > 0 && (
                        <div
                          style={{
                            position: 'absolute', // Position the button absolutely
                            top: '5px', // Align to the top
                            right: '5px', // Align to the right
                            width: '20px', // Set a small width
                            height: '20px', // Set a small height
                            display: 'flex', // Center the content
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%', // Make it circular
                            backgroundColor: 'red', // Red background for the button
                            color: 'white', // White color for the cross
                            fontSize: '16px', // Adjust font size for the cross
                            cursor: 'pointer', // Add pointer cursor
                            border: 'none', // Remove border
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
                            zIndex: '100',
                            fontWeight: 'bolder',
                          }}
                          onClick={() => removeAttribute(index)}
                          title="Remove"
                        >
                          &times; {/* Unicode for a cross symbol */}
                        </div>
                      )}
                      <div className="row form-group">
                        <div className="col-sm-4">
                          <label
                            htmlFor={`metrics_name_${index}`}
                            className="labels"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            value={attribute.metric_name}
                            onChange={(e) => {
                              const newAttributeState = [...merticState];
                              newAttributeState[index].metric_name =
                                e.target.value;
                              if (isEditing) {
                                newAttributeState[index].isEditing = isEditing;
                              }
                              setMetricState(newAttributeState);
                            }}
                            data-sentence-case="true"
                            className="form-control"
                            readOnly={readOnly && !isEditing}
                            id={`metrics_name_${index}`}
                            name={`metrics_name_${index}`}
                            placeholder="Enter metrics name, e.g, Rouge1 Score"
                            data-parsley-required-message="Name is required"
                            data-parsley-pattern-message="Name should only contain letters, numbers, and spaces"
                            data-parsley-trigger="keyup"
                            data-parsley-id={3}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label
                            htmlFor={`description_${index}`}
                            className="labels"
                          >
                            Metric Description
                          </label>
                          <textarea
                            className="form-control"
                            value={attribute.metric_description}
                            onChange={(e) => {
                              const newAttributeState = [...merticState];
                              if (isEditing) {
                                newAttributeState[index].isEditing = isEditing;
                              }
                              newAttributeState[index].metric_description =
                                e.target.value;
                              setMetricState(newAttributeState);
                            }}
                            data-sentence-case="true"
                            id={`description_${index}`}
                            name={`description_${index}`}
                            readOnly={readOnly && !isEditing}
                            placeholder="Enter metric description"
                            data-parsley-required-message="Metric description is required"
                            data-parsley-pattern-message="Metric description should only contain letters, numbers, and spaces"
                            data-parsley-trigger="keyup"
                            rows={1}
                            style={{ resize: 'vertical' }}
                            data-parsley-id={4}
                          />
                        </div>
                        <div className="col-sm-4">
                          <label
                            htmlFor={`measured_${index}`}
                            className="labels"
                          >
                            Measured
                          </label>
                          <div className="row">
                            <div className="radio c-radio col-sm-3 m0">
                              <label>
                                <input
                                  type="radio"
                                  checked={attribute.is_measured || false}
                                  onChange={() => {
                                    const newAttributeState = [...merticState];
                                    if (isEditing) {
                                      newAttributeState[index].isEditing =
                                        isEditing;
                                    }
                                    newAttributeState[index].is_measured = true;
                                    newAttributeState[index].is_range = null;
                                    setMetricState(newAttributeState);
                                  }}
                                  className="channel-type measured"
                                  name={`measured_${index}`}
                                  id={`measured_${index}`}
                                  disabled={readOnly && !isEditing}
                                  data-parsley-multiple="channel-type"
                                  data-parsley-error-message="Select Measured status"
                                  data-parsley-id={5}
                                />
                                <span className="fa fa-circle" /> Yes
                              </label>
                            </div>
                            <div className="radio c-radio col-sm-3 m0">
                              <label>
                                <input
                                  type="radio"
                                  className="channel-type measured"
                                  checked={attribute.is_measured === false}
                                  onChange={() => {
                                    const newAttributeState = [...merticState];
                                    if (isEditing) {
                                      newAttributeState[index].isEditing =
                                        isEditing;
                                    }
                                    newAttributeState[index].is_measured =
                                      false;
                                    delete newAttributeState[index].is_range;
                                    delete newAttributeState[index].uom_id;
                                    delete newAttributeState[index].uom_type;
                                    delete newAttributeState[index]
                                      .min_range_value; // Remove min_range_value
                                    delete newAttributeState[index]
                                      .max_range_value; // Remove max_range_value
                                    delete newAttributeState[index]
                                      .fixed_range_value; // Remove max_range_value
                                    setMetricState(newAttributeState);
                                  }}
                                  disabled={readOnly && !isEditing}
                                  name={`measured_${index}`}
                                  data-parsley-multiple="channel-type"
                                />
                                <span className="fa fa-circle" /> No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {attribute.is_measured && (
                        <div className="row form-group measurement-type-wrapper">
                          <div className="col-sm-3 chosen-order">
                            <label
                              htmlFor={`measurement_type_${index}`}
                              className="labels"
                            >
                              Measurement Type
                            </label>
                            <select
                              className="form-control chosen-select"
                              id={`measurement_type_${index}`}
                              name={`uom_type`}
                              disabled={readOnly && !isEditing}
                              value={attribute.uom_type || ''}
                              onChange={(e) => {
                                handleAttributeChange(
                                  index,
                                  'uom_type',
                                  e.target.value
                                );
                              }}
                            >
                              <option value="" disabled>
                                Select measurement type
                              </option>
                              {measurementOptions.map((option) => (
                                <option
                                  key={option.measurement_type_id}
                                  value={option.measurement_type_id}
                                >
                                  {option.type_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-sm-3 chosen-order">
                            <label htmlFor={`uom_${index}`} className="labels">
                              Measurement UOM
                            </label>
                            <select
                              className="form-control chosen-select"
                              id={`uom_${index}`}
                              name={`uom_${index}`}
                              disabled={
                                (readOnly && !isEditing) || !attribute.uom_type
                              }
                              value={attribute.uom_id || ''}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'uom_id',
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                Select UOM
                              </option>
                              {uomOptions
                                .filter(
                                  (unit) =>
                                    unit.measurement_type_id ===
                                    +(attribute?.uom_type ?? 0)
                                ) // Filter UOMs based on uom_type
                                .map((unit) => (
                                  <option key={unit.uom_id} value={unit.uom_id}>
                                    {unit.uom_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="col-sm-2">
                            <label
                              htmlFor={`range_${index}`}
                              className="labels"
                            >
                              Range
                            </label>
                            <div
                              className="row"
                              style={{ display: 'flex', gap: '15px' }}
                            >
                              <div className="radio c-radio m0">
                                <label>
                                  <input
                                    type="radio"
                                    checked={attribute.is_range || false}
                                    onChange={() => {
                                      const newAttributeState = [
                                        ...merticState,
                                      ];
                                      newAttributeState[index].is_range = true;
                                      delete newAttributeState[index]
                                        .fixed_range_value; // Remove fixed_range_value
                                      setMetricState(newAttributeState);
                                    }}
                                    className="channel-type measured"
                                    name={`range_${index}`}
                                    disabled={readOnly && !isEditing}
                                  />
                                  <span className="fa fa-circle" /> Yes
                                </label>
                              </div>
                              <div className="radio c-radio m0">
                                <label>
                                  <input
                                    type="radio"
                                    className="channel-type measured"
                                    checked={attribute.is_range === false}
                                    onChange={() => {
                                      const newAttributeState = [
                                        ...merticState,
                                      ];
                                      newAttributeState[index].is_range = false;
                                      delete newAttributeState[index]
                                        .min_range_value; // Remove min_range_value
                                      delete newAttributeState[index]
                                        .max_range_value; // Remove max_range_value
                                      setMetricState(newAttributeState);
                                    }}
                                    disabled={readOnly && !isEditing}
                                    name={`range_${index}`}
                                  />
                                  <span className="fa fa-circle" /> No
                                </label>
                              </div>
                            </div>
                          </div>
                          {attribute.is_range === true && (
                            <div className="col-sm-4 row">
                              <div className="col-sm-6">
                                <label className="labels">Min Range</label>
                                <div className="">
                                  <input
                                    type="text"
                                    disabled={readOnly && !isEditing}
                                    data-sentence-case="true"
                                    name="min_range_value"
                                    value={attribute.min_range_value}
                                    onChange={(e) => {
                                      const newAttributeState = [
                                        ...merticState,
                                      ];
                                      newAttributeState[index].min_range_value =
                                        e.target.value;
                                      if (isEditing) {
                                        newAttributeState[index].isEditing =
                                          isEditing;
                                      }
                                      setMetricState(newAttributeState);
                                    }}
                                    placeholder="Enter Max Range"
                                    className="form-control"
                                    maxLength={255}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <label className="labels">Max Range</label>
                                <div className="">
                                  <input
                                    type="text"
                                    disabled={readOnly && !isEditing}
                                    data-sentence-case="true"
                                    name="min_range_value"
                                    value={attribute.max_range_value}
                                    onChange={(e) => {
                                      const newAttributeState = [
                                        ...merticState,
                                      ];
                                      newAttributeState[index].max_range_value =
                                        e.target.value;
                                      if (isEditing) {
                                        newAttributeState[index].isEditing =
                                          isEditing;
                                      }
                                      setMetricState(newAttributeState);
                                    }}
                                    placeholder="Enter Max Range"
                                    className="form-control"
                                    maxLength={255}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {attribute.is_range === false && (
                            <div className="col-sm-4 row">
                              <div className="col-sm-6">
                                <label className="labels">Fixed Range</label>
                                <div className="">
                                  <input
                                    type="text"
                                    disabled={readOnly && !isEditing}
                                    data-sentence-case="true"
                                    name="fixed_range_value"
                                    value={attribute.fixed_range_value}
                                    onChange={(e) => {
                                      const newAttributeState = [
                                        ...merticState,
                                      ];
                                      newAttributeState[
                                        index
                                      ].fixed_range_value = e.target.value;
                                      if (isEditing) {
                                        newAttributeState[index].isEditing =
                                          isEditing;
                                      }
                                      setMetricState(newAttributeState);
                                    }}
                                    placeholder="Enter Fixed Range"
                                    className="form-control"
                                    maxLength={255}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TestCreate;
