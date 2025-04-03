/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Sidebar from '.././Sidebar';
import { useState } from 'react';
import { API } from '../../../apiconfig';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { AttributeState, AttributeValue } from '../../../types/DashboardTypes';
import { ReduxState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface FilteredUnit {
  name: string;
  value: number;
}
interface BaseModel {
  llm_name: string;
  llm_type: string;
  isEditing?: boolean;
}

const BaseModelCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const MOCK_API_BASE = 'http://localhost:8000';
  const modelId = location.pathname.split('/')[2] || '';
  const [filteredUnits, setFilteredUnits] = useState<FilteredUnit[][]>([
    [{ name: '', value: 0 }],
  ]);
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const initialBaseModel = {
    llm_name: '',
    llm_type: '',
  };
  const [baseModel, setBaseModel] = useState<BaseModel>(initialBaseModel);

  const initialAttributeState = [
    {
      attribute_description: '',
      attribute_name: '',
      attribute_value: {
        uom: '',
        value: '',
        is_measured: null,
        uom_type: '',
      },
    },
  ];
  const [attributeState, setAttributeState] = useState<AttributeState[]>(
    initialAttributeState
  );

  const DashboardState = useSelector(
    (state: ReduxState) => state.DashboardSlice
  );
  const [isEditing, setIsEditing] = useState(false);

  const measurementOptions = ['Parameters', 'Tokens', 'Model Size', 'Latency'];

  const filterUnits = (measurementType: string) => {
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

  const getMeasurementType = (value: string | number): string => {
    for (const measurementType of measurementOptions) {
      const units = filterUnits(measurementType);
      if (units.some((unit) => unit.value == value)) {
        return measurementType;
      }
    }
    return '';
  };

  useEffect(() => {
    if (readOnly) {
      const baseModelRedux = {
        llm_name: DashboardState.llmList?.llm_name || '',
        llm_type: DashboardState.llmList?.llm_type || '',
        isEditing: false,
      };
      setBaseModel(baseModelRedux);
      const attributeRedux = DashboardState.llmList?.attributes?.map(
        (attribute) => ({
          attribute_description: attribute.attribute_description,
          attribute_name: attribute.attribute_name,
          attribute_id: attribute.attribute_id,
          isEditing: false,
          attribute_value: {
            uom: attribute.attribute_value?.uom,
            value: attribute.attribute_value?.value,
            is_measured: attribute.attribute_value?.uom ? true : false,
            is_range: attribute.attribute_value?.is_range ? true : false,
            fixed_range_value: attribute.attribute_value?.fixed_range_value,
            min_range_value: attribute.attribute_value?.min_range_value,
            max_range_value: attribute.attribute_value?.max_range_value,
            uom_type: attribute.attribute_value?.uom
              ? getMeasurementType(attribute.attribute_value.uom)
              : '',
          },
        })
      );
      if (attributeRedux) {
        setAttributeState(attributeRedux);
      }
    } else {
      setAttributeState(initialAttributeState);
      setBaseModel(initialBaseModel);
    }
  }, [DashboardState.llmList, location.pathname]);

  const handleSave = async () => {
    try {
      // Validate baseModel
      if (!baseModel.llm_name.trim()) {
        toast.error('Model name is required');
        return;
      }
      if (!baseModel.llm_type.trim()) {
        toast.error('Model description is required');
        return;
      }

      // Validate attributeState
      for (let i = 0; i < attributeState.length; i++) {
        const attribute = attributeState[i];
        if (!attribute.attribute_name.trim()) {
          toast.error(`Attribute name is required for attribute ${i + 1}`);
          return;
        }
        if (!attribute.attribute_description.trim()) {
          toast.error(
            `Attribute description is required for attribute ${i + 1}`
          );
          return;
        }
        if (attribute.attribute_value.is_measured === null) {
          toast.error(`Measured status is required for attribute ${i + 1}`);
          return;
        }
        if (attribute.attribute_value.is_measured) {
          if (attribute?.attribute_value?.is_range === null) {
            toast.error(`Range status is required for attribute ${i + 1}`);
            return;
          }
          if (
            attribute?.attribute_value?.is_range === true &&
            (!attribute?.attribute_value?.min_range_value ||
              !attribute?.attribute_value?.max_range_value)
          ) {
            toast.error(
              `Min & Max range value is required for attribute ${i + 1}`
            );
            return;
          }
          if (
            attribute?.attribute_value?.is_range === false &&
            !attribute?.attribute_value?.fixed_range_value
          ) {
            toast.error(`Fixed range value is required for attribute ${i + 1}`);
            return;
          }
          if (
            !attribute?.attribute_value?.uom ||
            !attribute?.attribute_value?.uom_type
          ) {
            toast.error(
              `Measurement type & UOM is required for attribute ${i + 1}`
            );
            return;
          }
        }
      }
      // const response = await axios.post(
      //   API.API_CB + 'admin/llm',
      //   { ...baseModel, attributes: attributeState },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authObj.access_token}`,
      //     },
      //   }
      // );
      // const result = await response.data;
      const response = await axios.get(`http://localhost:8000/base_in`);
      const id = response.data.length + 1;
      await axios.post(`${MOCK_API_BASE}/base_in`, {
        id: id.toString(),
        ...baseModel,
        attributes: attributeState,
      });
      toast.success('Inference created successfully');
      setBaseModel({ llm_name: '', llm_type: '', isEditing: false });
      setAttributeState([
        {
          attribute_description: '',
          attribute_name: '',
          attribute_value: {
            uom: '',
            uom_type: '',
            value: '',
            is_measured: null,
          },
        },
      ]);
      navigate('/basemodel');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the base model'
      );
    }
  };

  const handleAttributeChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newAttributeState = [...attributeState];
    if (isEditing) {
      newAttributeState[index].isEditing = isEditing;
    }
    if (field === 'is_measured') {
      newAttributeState[index].attribute_value.is_measured = value as boolean;
    } else if (field === 'uom_type') {
      newAttributeState[index].attribute_value.uom_type = value as string;
      newAttributeState[index].attribute_value.uom = ''; // Reset UOM when type changes
      const newFilteredUnits = [...filteredUnits];
      newFilteredUnits[index] = filterUnits(value as string);
      setFilteredUnits(newFilteredUnits);
    } else if (field === 'is_range') {
      newAttributeState[index].attribute_value.is_range = value as boolean;
      if (value === true) {
        // Reset fixed_range_value when switching to range
        newAttributeState[index].attribute_value.fixed_range_value = undefined;
      } else {
        // Reset min_range_value and max_range_value when switching to fixed range
        newAttributeState[index].attribute_value.min_range_value = undefined;
        newAttributeState[index].attribute_value.max_range_value = undefined;
      }
    } else if (field === 'min_range_value' || field === 'max_range_value') {
      newAttributeState[index].attribute_value[field] = value as string;
    } else if (field === 'fixed_range_value') {
      newAttributeState[index].attribute_value.fixed_range_value =
        value as string;
    } else {
      // Handle changes for 'uom' and 'value' fields
      if (field === 'uom' || field === 'value') {
        newAttributeState[index].attribute_value[field] = value as string;
      }
    }
    setAttributeState(newAttributeState);
  };

  const handleModelChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setBaseModel((prevState) => ({
      ...prevState,
      isEditing,
      [name]: value,
    }));
  };

  // console.log("dashboardState", DashboardState);
  console.log('attributeState', attributeState);
  // console.log("baseModel", baseModel);

  const addAttribute = () => {
    setAttributeState([
      ...attributeState,
      {
        attribute_description: '',
        attribute_name: '',
        attribute_value: {
          uom: '',
          uom_type: '',
          value: '',
          is_measured: null,
        },
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setAttributeState(attributeState.filter((_, i) => i !== index));
  };

  const handleUpdateModel = async (id: string, model: BaseModel) => {
    try {
      // const response = await axios.put(
      //   API.API_CB + 'admin/llm/' + id,
      //   { ...model },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authObj.access_token}`,
      //     },
      //   }
      // );
      // const result = await response.data;
      // console.log('result', result);
      await axios.put(`${MOCK_API_BASE}/base_in/${id}`, {
        ...model,
        attributes: attributeState,
      });
      toast.success('Model updated successfully');
      navigate('/basemodel');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating the base model'
      );
    }
  };

  const handleUpdateAttribute = async (
    attributeId: string,
    attribute: AttributeValue
  ) => {
    try {
      const response = await axios.put(
        API.API_CB + 'admin/llm/' + modelId + '/attribute/' + attributeId,
        { ...attribute },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      const result = await response.data;
      console.log('result', result);
      toast.success('Attribute updated successfully');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error('Error:', error);
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating the attribute'
      );
    }
  };

  const handleUpdateFlow = async () => {
    attributeState.forEach(async (attribute) => {
      if (attribute.isEditing && attribute.attribute_id) {
        await handleUpdateAttribute(attribute.attribute_id, {
          ...attribute.attribute_value,
          attribute_name: attribute.attribute_name,
          attribute_description: attribute.attribute_description,
          attribute_value: attribute.attribute_value.value,
        });
      }
    });
    if (baseModel.isEditing) {
      await handleUpdateModel(modelId, baseModel);
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
              Base Model{' '}
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
                  Base Model
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
                          <label className="labels"> Model Name: </label>
                          <input
                            type="text"
                            name="llm_name"
                            value={baseModel.llm_name}
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
                            name="llm_type"
                            data-sentence-case="true"
                            value={baseModel.llm_type}
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
                <div id="metrics-section">
                  {attributeState?.map((attribute, index) => (
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
                            value={attribute.attribute_name}
                            onChange={(e) => {
                              const newAttributeState = [...attributeState];
                              newAttributeState[index].attribute_name =
                                e.target.value;
                              if (isEditing) {
                                newAttributeState[index].isEditing = isEditing;
                              }
                              setAttributeState(newAttributeState);
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
                            data-parsley-id={8}
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
                            value={attribute.attribute_description}
                            onChange={(e) => {
                              const newAttributeState = [...attributeState];
                              if (isEditing) {
                                newAttributeState[index].isEditing = isEditing;
                              }
                              newAttributeState[index].attribute_description =
                                e.target.value;
                              setAttributeState(newAttributeState);
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
                            data-parsley-id={10}
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
                                  checked={
                                    attribute.attribute_value.is_measured ||
                                    false
                                  }
                                  onChange={() => {
                                    const newAttributeState = [
                                      ...attributeState,
                                    ];
                                    if (isEditing) {
                                      newAttributeState[index].isEditing =
                                        isEditing;
                                    }
                                    newAttributeState[
                                      index
                                    ].attribute_value.is_measured = true;
                                    setAttributeState(newAttributeState);
                                  }}
                                  className="channel-type measured"
                                  name={`measured_${index}`}
                                  id={`measured_${index}`}
                                  disabled={readOnly && !isEditing}
                                  data-parsley-multiple="channel-type"
                                  data-parsley-error-message="Select Measured status"
                                  data-parsley-id={13}
                                />
                                <span className="fa fa-circle" /> Yes
                              </label>
                            </div>
                            <div className="radio c-radio col-sm-3 m0">
                              <label>
                                <input
                                  type="radio"
                                  className="channel-type measured"
                                  checked={
                                    attribute.attribute_value.is_measured ===
                                    false
                                  }
                                  onChange={() => {
                                    const newAttributeState = [
                                      ...attributeState,
                                    ];
                                    if (isEditing) {
                                      newAttributeState[index].isEditing =
                                        isEditing;
                                    }
                                    newAttributeState[
                                      index
                                    ].attribute_value.is_measured = false;
                                    setAttributeState(newAttributeState);
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
                      {attribute.attribute_value.is_measured && (
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
                              value={attribute.attribute_value.uom_type || ''}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'uom_type',
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select measurement type</option>
                              {measurementOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
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
                              disabled={readOnly && !isEditing}
                              value={attribute.attribute_value.uom || ''}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'uom',
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select UOM</option>
                              {filterUnits(
                                attribute.attribute_value.uom_type
                              ).map((unit, fIndex) => (
                                <option key={fIndex} value={unit.value}>
                                  {unit.name}
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
                                    checked={
                                      attribute.attribute_value.is_range ||
                                      false
                                    }
                                    name={`range_${index}`}
                                    onChange={() =>
                                      handleAttributeChange(
                                        index,
                                        'is_range',
                                        true
                                      )
                                    }
                                    className="channel-type measured"
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
                                    checked={
                                      attribute.attribute_value.is_range ===
                                      false
                                    }
                                    name={`range_${index}`}
                                    onChange={() =>
                                      handleAttributeChange(
                                        index,
                                        'is_range',
                                        false
                                      )
                                    }
                                    disabled={readOnly && !isEditing}
                                  />
                                  <span className="fa fa-circle" /> No
                                </label>
                              </div>
                            </div>
                          </div>
                          {attribute.attribute_value.is_range === true && (
                            <div className="col-sm-4 row">
                              <div className="col-sm-6">
                                <label className="labels">Min Range</label>
                                <div className="">
                                  <input
                                    type="text"
                                    disabled={readOnly && !isEditing}
                                    data-sentence-case="true"
                                    name="min_range_value"
                                    value={
                                      attribute.attribute_value.min_range_value
                                    }
                                    onChange={(e) =>
                                      handleAttributeChange(
                                        index,
                                        'min_range_value',
                                        e.target.value
                                      )
                                    }
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
                                    value={
                                      attribute.attribute_value.max_range_value
                                    }
                                    onChange={(e) =>
                                      handleAttributeChange(
                                        index,
                                        'max_range_value',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter Max Range"
                                    className="form-control"
                                    maxLength={255}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {attribute.attribute_value.is_range === false && (
                            <div className="col-sm-4 row">
                              <div className="col-sm-6">
                                <label className="labels">Fixed Range</label>
                                <div className="">
                                  <input
                                    type="text"
                                    disabled={readOnly && !isEditing}
                                    data-sentence-case="true"
                                    name="fixed_range_value"
                                    value={
                                      attribute.attribute_value
                                        .fixed_range_value
                                    }
                                    onChange={(e) =>
                                      handleAttributeChange(
                                        index,
                                        'fixed_range_value',
                                        e.target.value
                                      )
                                    }
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
                {/* <div class="row form-group">
                  <div id="metrics-wrapper" class="col-sm-12">
                     <div class="row form-group metrics-row">
                        <div class="col-sm-3">
                           <label class="labels"> Metrics Name: </label>
                              <input type="text" name="metrics_name[]" value="" required="" data-sentence-case="true" data-parsley-error-message="Enter metrics name" placeholder="Enter metrics name, e.g, Rouge1 Score" class="form-control" maxlength="255">
                        </div>
                        <div class="col-sm-4">
                           <label class="labels"> &nbsp; </label>
                              <input type="text" name="description[]" value="" required="" data-sentence-case="true" data-parsley-error-message="Enter description" placeholder="Enter description.." class="form-control" maxlength="255">
                        </div>
                        <div class="col-sm-2 chosen-order">
                           <label class="labels"> &nbsp; </label>
                           <select name="uomType[]" value="" required data-parsley-error-message="Select uom type" placeholder="Select uom type" class="form-control chosen-select">
                              <option value=""> Select UOM Type </option>
                              <option value="Length/Distance">Length/Distance</option>
                              <option value="Mass/Weight">Mass/Weight</option>
                              <option value="Digital Storage">Digital Storage</option>
                              <option value="Power">Power</option>
                              <option value="Speed">Speed</option>
                           </select>
                        </div>
                        <div class="col-sm-2 chosen-order">
                           <label class="labels"> &nbsp; </label>
                           <select name="uom[]" value="" required data-parsley-error-message="Select uom" placeholder="Select uom" class="form-control chosen-select">
                              <option value=""> Select UOM </option>
                              <option value="A100">A100</option>
                              <option value="ms">ms</option>
                              <option value="GB">GB</option>
                              <option value="%">%</option>
                           </select>
                        </div>
                     </div>
                     <div class="row form-group metrics-row">
                        <div class="col-sm-3">
                              <input type="text" name="metrics_name[]" value="" data-sentence-case="true" data-parsley-error-message="Enter metrics name" placeholder="Enter metrics name, e.g, GLEU Score" class="form-control" maxlength="255">
                        </div>
                        <div class="col-sm-4">
                              <input type="text" name="description[]" value="" data-sentence-case="true" data-parsley-error-message="Enter description" placeholder="Enter description.." class="form-control" maxlength="255">
                        </div>
                        <div class="col-sm-2 chosen-order">
                           <select name="uomType[]" value="" required data-parsley-error-message="Select uom type" placeholder="Select uom type" class="form-control chosen-select">
                              <option value=""> Select UOM Type </option>
                              <option value="Length/Distance">Length/Distance</option>
                              <option value="Mass/Weight">Mass/Weight</option>
                              <option value="Digital Storage">Digital Storage</option>
                              <option value="Power">Power</option>
                              <option value="Speed">Speed</option>
                           </select>
                        </div>
                        <div class="col-sm-2 chosen-order">
                           <select name="uom[]" value="" required data-parsley-error-message="Select uom" placeholder="Select uom" class="form-control chosen-select">
                              <option value=""> Select uom </option>
                              <option value="A100">A100</option>
                              <option value="ms">ms</option>
                              <option value="GB">GB</option>
                              <option value="%">%</option>
                           </select>
                        </div>
                        <div class="col-sm-1">
                           <div class="close-btn"><i class="fa fa-times delete-section" aria-hidden="true" style="color:red;"></i></div>
                        </div>
                     </div>
                  </div>
               </div> */}
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

export default BaseModelCreate;
