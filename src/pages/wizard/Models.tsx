/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../apiconfig';
import { Attribute, DatasetInfo, LlmFamily } from '../../types/ModelTypes';
import { ApiErrorResponse } from '../../types/wizardTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCompareModels,
  updateDataSet,
  updateLoadingState,
  updateModels,
} from '../../redux/wizardSlice';
import { AppDispatch, ReduxState } from '../../redux/store';
import TableLoader from '../components/TableLoader';
import { toast } from 'react-toastify';
interface ShowState {
  show: boolean;
}

interface FilterState {
  data: LlmFamily[];
  show: boolean;
}

const Models: React.FC = () => {
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const [showTable, setShowTable] = useState<ShowState[]>([]);
  const [selectedLlms, setSelectedLlms] = useState<number[]>([]);
  const [dataSets, setDataSets] = useState<DatasetInfo[]>([]);
  const [modelsData, setModelsData] = useState<LlmFamily[]>([]);
  const [filterData, setFilterData] = useState<FilterState>({
    data: [],
    show: false,
  });
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const attributeOrder = [
    'modelType',
    'context_tokens',
    'parameters',
    'model_size',
  ];

  useEffect(() => {
    const fetchModels = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'models');
        // const response = await axios.get(API.LOCAL_URL + "models");
        const data: LlmFamily[] = await response.data.data;
        data.map((llfamily) =>
          llfamily.attributes.sort((a, b) => {
            const orderA = attributeOrder.indexOf(a.attribute_name);
            const orderB = attributeOrder.indexOf(b.attribute_name);
            return orderA - orderB;
          })
        );
        const newshowState = data.map(() => ({ show: false }));
        setShowTable(newshowState);
        setModelsData(data);
        setFilterData({ ...filterData, data });
        dispatch(updateLoadingState(false));
      } catch (error) {
        setModelsData([]);
      }
    };

    const fetchDataSets = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'metrics/datasets');
        // const response = await axios.get(API.LOCAL_URL + "datasets");
        setDataSets(response.data.data);
      } catch (error) {
        setDataSets([]);
      }
    };

    const fetchAllData = async () => {
      dispatch(updateLoadingState(true));

      const results = await Promise.allSettled([
        fetchModels(),
        fetchDataSets(),
      ]);

      results.forEach((result) => {
        if (result.status === 'rejected') {
          console.error('Error in one of the API calls:', result.reason);
        }
      });
    };

    fetchAllData();
    dispatch(updateLoadingState(false));
  }, []);

  useEffect(() => {
    setSelectedLlms(WizardState.models);
  }, [WizardState.models]);

  const handleShowTable = (index: number) => {
    setShowTable((prevShowTable) => {
      const updatedShowTable = [...prevShowTable];
      updatedShowTable[index].show = !updatedShowTable[index].show;
      return updatedShowTable;
    });
  };

  const getAttributeValue = (attribute: Attribute) => {
    if (typeof attribute.attribute_value === 'object') {
      return `${attribute.attribute_value?.value} ${attribute.attribute_value?.uom}`;
    }
    return attribute.attribute_value;
  };

  useEffect(() => {
    dispatch(updateModels(selectedLlms));
  }, [selectedLlms]);

  console.log('selectedLlms >> ', selectedLlms);

  const handleCheckboxChange = (value: number) => {
    setSelectedLlms((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(value)) {
        return prevSelectedTypes.filter((type) => type !== value);
      } else {
        return [...prevSelectedTypes, value];
      }
    });
  };

  const handleNext = async () => {
    const intitalErrorState = { show: false, message: '' };
    if (selectedLlms.length == 0) {
      toast.error('Please Select model');
      return;
    }
    try {
      const response = await axios.post(
        API.API_CB + 'models',
        { llm_ids: [...new Set([...selectedLlms])] },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      await response.data;
      setErrorState({ ...intitalErrorState });
      dispatch(updateModels([...selectedLlms]));
      navigate('/wizard/machines');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('error', error);
      toast.error(
        error.response?.data.message || 'An error occurred. Please try again.'
      );
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const regex = new RegExp(searchTerm, 'i');

    let dataArray = [...filterData.data];
    dataArray = dataArray?.filter(
      (data) =>
        regex.test(data.llm_family) ||
        data?.attributes?.some(
          (attr) =>
            regex.test(attr?.attribute_name) ||
            regex.test(attr?.attribute_value?.toString())
        ) ||
        data.llm_variants.some(
          (variant) =>
            regex.test(variant?.llm_name) ||
            regex.test(variant?.llm_family) ||
            variant?.llm_capability?.some((capability) =>
              regex.test(capability?.capability_name)
            ) ||
            variant?.target_cloud?.some(
              (cloud) =>
                regex.test(cloud?.cloud_name) || regex.test(cloud?.description)
            )
        )
    );
    setModelsData(dataArray);
  };

  const handleDataSet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    console.log(value);

    dispatch(updateDataSet(value));
  };
  console.log('wizardState', WizardState.selectedDataSet);

  const handleCompareModels = () => {
    dispatch(updateCompareModels(true));
    navigate('/wizard/compare');
  };

  if (WizardState.loading) {
    return <TableLoader />;
  } else
    return (
      <section className="main-section">
        <div className="content-wrapper">
          <div className="panel panel-default main-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="wizard" id="myWizard">
                  <div className="step s3" id="models-screen">
                    <div className="panel-heading">
                      <h4 className="panel-title">Models</h4>
                    </div>
                    <div
                      className="panel-body panel-collapse collapse in"
                      aria-expanded="true"
                    >
                      <div className="row form-group">
                        <div className="col-lg-12">
                          <h4 style={{ marginBottom: '15px' }}>
                            List of Models
                            <div className="pull-right">
                              <div className="compare-outer">
                                <p className="error-compare"></p>
                                <button
                                  type="button"
                                  className="mt-m-20 btn btn-info btn-xs btn-tcenter"
                                  id="compare-models"
                                  onClick={handleCompareModels}
                                >
                                  Get details
                                </button>
                              </div>
                            </div>
                          </h4>
                          <div className="table-main-div">
                            <div className="chosen-order model-list-dataset">
                              <div className="dataset-outer">
                                <label>Dataset</label>
                                <select
                                  className="chosen-select form-control"
                                  name="data_set"
                                  onChange={handleDataSet}
                                  data-parsley-error-message="Select dataset"
                                  data-parsley-id="47"
                                >
                                  {dataSets?.map((data) => (
                                    <option
                                      key={data?.data_id}
                                      value={data?.data_id}
                                    >
                                      {data?.data_name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div
                              id="InfraDataList_wrapper"
                              className="dataTables_wrapper form-inline no-footer"
                            >
                              <div className="row">
                                <div className="col-xs-6">
                                  <div
                                    className="dataTables_length"
                                    id="InfraDataList_length"
                                    style={{ display: 'none' }}
                                  >
                                    <label>
                                      <select
                                        name="InfraDataList_length"
                                        aria-controls="InfraDataList"
                                        className="form-control input-sm"
                                      >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                      </select>
                                      records per page
                                    </label>
                                  </div>
                                </div>
                                <div className="col-xs-6">
                                  <div
                                    id="InfraDataList_filter"
                                    className="dataTables_filter"
                                  >
                                    <label>
                                      Search:
                                      <input
                                        onChange={handleSearch}
                                        type="search"
                                        className="form-control input-sm"
                                        placeholder="Filter"
                                        aria-controls="InfraDataList"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <table
                                className="table table-striped table-hover pb dataTable no-footer"
                                id="InfraDataList"
                                cellSpacing="0"
                                width="100%"
                                role="grid"
                                aria-describedby="InfraDataList_info"
                                style={{ width: '100%' }}
                              >
                                <thead>
                                  <tr role="row">
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '199.525px' }}
                                    >
                                      <a
                                        className="ml-sm help-icon para-desc"
                                        data-id="model"
                                      >
                                        Model
                                      </a>
                                    </th>
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '199.925px' }}
                                    >
                                      <a
                                        className="ml-sm help-icon para-desc"
                                        data-id="model_type"
                                      >
                                        Model Type
                                      </a>
                                    </th>
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '127.162px' }}
                                    >
                                      <a
                                        className="ml-sm help-icon para-desc"
                                        data-id="context_token"
                                      >
                                        Context Tokens
                                      </a>
                                    </th>
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '94.8px' }}
                                    >
                                      <a
                                        className="ml-sm help-icon para-desc"
                                        data-id="parameters"
                                      >
                                        Parameters
                                      </a>
                                    </th>
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '130.45px' }}
                                    >
                                      <a
                                        className="ml-sm help-icon para-desc"
                                        data-id="model_size"
                                      >
                                        Model Size (GB)
                                      </a>
                                    </th>
                                    <th
                                      className="sorting_disabled"
                                      rowSpan={1}
                                      colSpan={1}
                                      style={{ width: '43.7375px' }}
                                    ></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modelsData?.map((model, index) => (
                                    <React.Fragment key={model?.llm_family}>
                                      <tr
                                        data-id="546"
                                        className="dataList r546 odd shown"
                                        role="row"
                                      >
                                        <td className="" width="24%">
                                          <a className="">
                                            {model?.llm_family}
                                          </a>
                                        </td>
                                        <td width="24%">{'_'}</td>
                                        {model?.attributes?.map(
                                          (attribute, aindex) => (
                                            <td
                                              key={aindex}
                                              width={`${
                                                aindex < 2 ? '20%' : ''
                                              }`}
                                            >
                                              {getAttributeValue(attribute)}
                                            </td>
                                          )
                                        )}
                                        <td
                                          className="no-filter details-control"
                                          width="5%"
                                        >
                                          <i
                                            className={`fa ${
                                              showTable[index]?.show
                                                ? 'fa-minus-circle'
                                                : 'fa-plus-circle'
                                            }`}
                                            aria-hidden="true"
                                            onClick={() =>
                                              handleShowTable(index)
                                            }
                                          ></i>
                                        </td>
                                      </tr>
                                      {showTable[index]?.show ? (
                                        <tr>
                                          <td colSpan={6}>
                                            <div className="inference-wrapper">
                                              <div className="pull-right">
                                                <div className="col-sm-12 form-group model-task-type">
                                                  <label
                                                    style={{
                                                      textTransform: 'initial',
                                                    }}
                                                  >
                                                    Task type
                                                  </label>
                                                  <select
                                                    className="chosen-select form-control"
                                                    name="task_type"
                                                    defaultValue={
                                                      'Document Analysis LLMs'
                                                    }
                                                    data-parsley-error-message="Select task type"
                                                    style={{ display: 'none' }}
                                                  >
                                                    <option value="">
                                                      Select task type
                                                    </option>
                                                    <option value="Document Analysis LLMs">
                                                      Document Analysis LLMs
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                              <table
                                                border={0}
                                                className="data-child-row sub-table-main"
                                                data-id="546"
                                              >
                                                <thead>
                                                  <tr>
                                                    <th
                                                      className="checkbox-div"
                                                      style={{
                                                        textAlign: 'center',
                                                      }}
                                                    ></th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-original-title=""
                                                        data-id="model_name"
                                                      >
                                                        Model name
                                                      </a>
                                                    </th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-id="bit"
                                                        data-original-title=""
                                                      >
                                                        Bit
                                                      </a>
                                                    </th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-id="inference_method"
                                                        data-original-title=""
                                                      >
                                                        Inference Method
                                                      </a>
                                                    </th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-id="tps"
                                                        data-original-title=""
                                                      >
                                                        TPS (A100)
                                                      </a>
                                                    </th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-id="throughput_a100"
                                                        data-original-title=""
                                                      >
                                                        Throughput (A100)
                                                      </a>
                                                    </th>
                                                    <th>
                                                      <a
                                                        className="ml-sm help-icon para-desc"
                                                        title=""
                                                        data-id="latency"
                                                        data-original-title=""
                                                      >
                                                        Latency{' '}
                                                        <span
                                                          style={{
                                                            textTransform:
                                                              'lowercase',
                                                          }}
                                                        >
                                                          (ms)
                                                        </span>
                                                      </a>
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {model?.llm_variants?.map(
                                                    (variant, index) => (
                                                      <React.Fragment
                                                        key={variant?.llm_id}
                                                      >
                                                        <tr
                                                          data-id="201"
                                                          className="sub-table"
                                                          key={index}
                                                        >
                                                          <td
                                                            width="7%"
                                                            className="checkbox-div"
                                                          >
                                                            <div className="c-checkbox">
                                                              <label>
                                                                <input
                                                                  type="checkbox"
                                                                  name="inf_checkbox[]"
                                                                  className="checkall"
                                                                  checked={selectedLlms?.includes(
                                                                    variant?.llm_id
                                                                  )}
                                                                  onChange={() =>
                                                                    handleCheckboxChange(
                                                                      variant?.llm_id
                                                                    )
                                                                  }
                                                                />{' '}
                                                                <span className="fa fa-check"></span>{' '}
                                                              </label>
                                                            </div>
                                                          </td>
                                                          <td>
                                                            {variant?.llm_name}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                'center',
                                                            }}
                                                          >
                                                            {variant?.quantization_bit ||
                                                              '__'}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textTransform:
                                                                'none',
                                                            }}
                                                          >
                                                            {
                                                              variant?.inference_method
                                                            }
                                                            <a
                                                              className="ml-sm help-icon"
                                                              data-toggle="tooltip"
                                                              data-placement="bottom"
                                                              title=""
                                                              data-original-title=""
                                                            >
                                                              <em className="icon-info"></em>
                                                            </a>
                                                          </td>
                                                          <td>31</td>
                                                          <td
                                                            className="throughtput"
                                                            data-text="73"
                                                            data-document="88"
                                                            data-ques-ans="94"
                                                            data-sql="107"
                                                          >
                                                            {variant?.throughput
                                                              ? variant?.throughput
                                                              : '__'}
                                                          </td>
                                                          <td
                                                            className="latency"
                                                            data-text="6"
                                                            data-document="3"
                                                            data-ques-ans="5"
                                                            data-sql="7"
                                                          >
                                                            {variant?.latency
                                                              ? variant?.latency
                                                              : '__'}
                                                          </td>
                                                        </tr>
                                                      </React.Fragment>
                                                    )
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      ) : (
                                        ''
                                      )}
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {errorState.show && (
                        <p style={{ color: 'red' }}>{errorState.message}</p>
                      )}
                      <div className="row">
                        <div className="col-sm-12">
                          <input type="hidden" name="model_select" value="" />
                          <input type="hidden" name="view_mode" value="" />
                          <div className="pull-right">
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="prev"
                              data-prev-pageid="2"
                              onClick={() => navigate('/wizard/toolkit')}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              id="model-validate"
                              onClick={handleNext}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Models;
