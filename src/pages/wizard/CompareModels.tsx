/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../redux/store';
import { updateLoadingState, updateModels } from '../../redux/wizardSlice';
import axios, { AxiosError } from 'axios';
import { API } from '../../apiconfig';
import { toast } from 'react-toastify';
import { ApiErrorResponse, CompareData } from '../../types/wizardTypes';
import TableLoader from '../components/TableLoader';
import {
  generateLineData,
  generateMultiChartData,
  mappedChartData,
} from '../../utils/ChartData';
import LineChart from '../components/LineChart';
import { useNavigate } from 'react-router-dom';
import MultiSelect from '../components/MultiSelect';
import { models, ModelsName } from '../../utils/ModelsData';

const CompareModels: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  const [compareData, setCompareData] = useState<CompareData[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelsName[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // console.log("wizardState", WizardState);
  const fetchDataSets = async (llmId: number, datasetId: number) => {
    try {
      dispatch(updateLoadingState(true));
      const response = await axios.get(
        API.API_CB + `metrics/llm/${llmId}/dataset/${datasetId}`
      );
      // const response = await axios.get(API.LOCAL_URL + `metrics`);
      console.log('this is response', response);

      const newdata: CompareData | null = response.data.data;
      if (compareData.length > 0 && newdata) {
        setCompareData((prev) => [...prev, newdata]);
      } else {
        setCompareData([response.data.data]);
      }
      if (!newdata) {
        toast.error('Unable to fetch data');
      }
      dispatch(updateLoadingState(false));
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setCompareData([]);
      toast.error(
        error.response?.data.message || 'An error occurred. Please try again.'
      );
      dispatch(updateLoadingState(false));
    }
  };

  useEffect(() => {
    if (WizardState.models.length > 0) {
      WizardState.models.forEach((model) => {
        fetchDataSets(model, WizardState.selectedDataSet || 1);
        // fetchDataSets(model, 3);
        // fetchDataSets(13, 3);
      });
    }
  }, [WizardState.models]);

  const handleBack = () => {
    navigate('/wizard/models');
  };
  const handleSelect = (model: ModelsName) => {
    // Check if the model's llm_family_id is already in the selectedModels array
    if (
      !selectedModels.some(
        (selectedModel) => selectedModel.llm_family_id === model.llm_family_id
      ) &&
      model.llm_family_id
    ) {
      fetchDataSets(model.llm_family_id, WizardState.selectedDataSet || 1);
      // fetchDataSets(13, 3);
      dispatch(updateModels(model.llm_family_id));
      setSelectedModels((prev) => [...prev, model]);
    }
  };

  const handleRemove = (model: ModelsName) => {
    setSelectedModels(
      selectedModels.filter(
        (selected) => selected.llm_family_id !== model.llm_family_id
      )
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (WizardState.models.length > 0) {
      const preSelectedModels = models.filter((model) =>
        WizardState?.models?.some(
          (wizardModel) => wizardModel === model?.llm_family_id
        )
      );
      setSelectedModels([...preSelectedModels]);
    }
  }, [WizardState.models]);

  // console.log("wizardState models", WizardState.models);
  // console.log("selected Models", selectedModels);
  // console.log("selected mappedChartData", mappedChartData);
  console.log('selected compareData', compareData);

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
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Compare Models
                      <div className="pull-right">
                        <button
                          type="button"
                          className="mt-m-20 btn btn-info btn-xs btn-tcenter"
                          id="compare-back-btn"
                          onClick={handleBack}
                        >
                          Back
                        </button>
                      </div>
                    </h4>
                  </div>
                  <div className="panel-body panel-collapse collapse in">
                    <div className="row form-group">
                      <div className="col-sm-4 chosen-order form-group">
                        <label> Select model(s) to compare </label>
                        <MultiSelect
                          handleSelect={handleSelect}
                          isDropdownOpen={isDropdownOpen}
                          handleRemove={handleRemove}
                          selectedModels={selectedModels}
                          toggleDropdown={toggleDropdown}
                        />
                      </div>
                      <div className="col-sm-4 chosen-order form-group">
                        <label> Select dataset </label>
                        <select
                          className="chosen-select form-control"
                          name="data_set1"
                          data-parsley-error-message="Select dataset"
                          data-parsley-id={76}
                          // style={{ display: "none" }}
                        >
                          <option value="">Select dataset</option>
                          <option value="squad">SQUAD</option>
                          <option value="rag">RAG Dataset 12000</option>
                          <option value="orca-math">
                            Microsoft/orca-math-word-problems-200k
                          </option>
                        </select>
                      </div>
                      <div className="col-sm-4 chosen-order form-group">
                        <label> Task type </label>
                        <select
                          className="chosen-select form-control"
                          name="task_type"
                          data-parsley-error-message="Select task type"
                          data-parsley-id={78}
                          // style={{ display: "none" }}
                        >
                          <option value="">Select task type</option>
                          <option value="Question & Answering">
                            {' '}
                            Question &amp; Answering{' '}
                          </option>
                        </select>
                      </div>
                      {/* <div className="col-sm-4 chosen-order form-group">
                                 <label> Show metrics </label>
                                 <select className="chosen-select form-control" name="metrics" required data-parsley-error-message="Select metrics">
                                    <option value="">Select metrics</option>
                                    <option value="Througput & accuracy" selected>Througput & accuracy</option>
                                    <option value="Perplexity">Perplexity</option>
                                 </select>
                               </div> */}
                    </div>
                    <div className="row form-group">
                      <div className="col-lg-12">
                        <h4> Comparison </h4>
                        <div className="table-main-div freeze-columns-container">
                          <table
                            className="table table-striped table-hover pb compare-table1"
                            cellSpacing={0}
                            width="100%"
                            id="compare-table1"
                          >
                            <thead>
                              <tr>
                                <th rowSpan={2} className="freeze-columns">
                                  {' '}
                                  Model{' '}
                                </th>
                                <th rowSpan={2} className="freeze-columns2">
                                  {' '}
                                  Bits{' '}
                                </th>
                                <th rowSpan={2} className="freeze-columns3">
                                  {' '}
                                  Method{' '}
                                </th>
                                <th
                                  colSpan={7}
                                  style={{ textAlign: 'center' }}
                                  data-id="zero_shot"
                                  className="para-desc"
                                >
                                  {' '}
                                  Performance metric ↑
                                </th>
                                <th
                                  colSpan={6}
                                  style={{
                                    textAlign: 'center',
                                    borderLeft: '1px solid #eee',
                                  }}
                                  data-id="perplexity"
                                  className="para-desc"
                                >
                                  System metric ↓
                                </th>
                              </tr>
                              <tr>
                                <th
                                  data-id="rouge1-score"
                                  className="para-desc"
                                >
                                  Rouge1 Score
                                </th>
                                <th
                                  data-id="rouge2-score"
                                  className="para-desc"
                                >
                                  Rouge2 Score
                                </th>
                                <th
                                  data-id="rougel-score"
                                  className="para-desc"
                                >
                                  RougeL Score
                                </th>
                                <th data-id="rougel-sum" className="para-desc">
                                  RougeL Sum
                                </th>
                                <th data-id="gleu-score" className="para-desc">
                                  GLEU Score
                                </th>
                                <th data-id="mauve-score" className="para-desc">
                                  MAUVE Score
                                </th>
                                <th
                                  data-id="meteor-score"
                                  className="para-desc"
                                >
                                  METEOR Score
                                </th>
                                <th
                                  data-id="samples-per-second"
                                  className="para-desc"
                                >
                                  Samples Per Second
                                </th>
                                <th
                                  data-id="latency-seconds"
                                  className="para-desc"
                                >
                                  Latency (seconds)
                                </th>
                                <th
                                  data-id="avg-cpu-utilization"
                                  className="para-desc"
                                >
                                  Avg CPU Utilization (%)
                                </th>
                                <th
                                  data-id="avg-gpu-ram-utilization"
                                  className="para-desc"
                                >
                                  Avg GPU RAM Utilization (%)
                                </th>
                                <th
                                  data-id="cpu-ram-after-load"
                                  className="para-desc"
                                >
                                  CPU RAM After Load (GB)
                                </th>
                                <th
                                  data-id="used-gpu-ram-after-load"
                                  className="para-desc"
                                >
                                  Used GPU RAM After Load (GB)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {compareData?.length > 0 &&
                                compareData?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="model-name freeze-columns">
                                      {item?.inference_name}
                                    </td>
                                    <td className="freeze-columns2">
                                      {item?.test_output_json?.quantization ||
                                        '-'}
                                    </td>
                                    <td
                                      className="freeze-columns3"
                                      style={{ textTransform: 'initial' }}
                                    >
                                      {item?.test_output_json?.method || '-'}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.rouge1_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.rouge2_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.rougel_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.rougelsum_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.gleu_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.mauve_score}
                                    </td>
                                    <td>
                                      {item?.test_output_json?.meteor_score}
                                    </td>
                                    <td>
                                      {
                                        item?.test_output_json
                                          ?.samples_per_second
                                      }
                                    </td>
                                    <td>
                                      {item?.test_output_json?.latency_seconds}
                                    </td>
                                    <td>
                                      {
                                        item?.test_output_json
                                          ?.avg_cpu_utilization_percentage
                                      }
                                    </td>
                                    <td>
                                      {
                                        item?.test_output_json
                                          ?.avg_gpu_ram_utilization_percentage
                                      }
                                    </td>
                                    <td>
                                      {
                                        item?.test_output_json
                                          ?.cpu_ram_after_load_gb
                                      }
                                    </td>
                                    <td>
                                      {
                                        item?.test_output_json
                                          ?.used_gpu_ram_after_load_gb
                                      }
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                          }}
                        >
                          {mappedChartData?.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                width: '48%',
                                margin: '10px 2px',
                                backgroundColor: '#f4f4f4',
                                padding: '4px',
                                borderRadius: '5px',
                              }}
                            >
                              {item?.yLabel == 'Scores' &&
                              compareData?.length > 0 ? (
                                <LineChart
                                  chartData={generateMultiChartData(
                                    compareData?.map((item) =>
                                      Number(
                                        item?.test_output_json?.rouge1_score
                                      )
                                    ),
                                    compareData?.map((item) =>
                                      Number(
                                        item?.test_output_json?.rouge2_score
                                      )
                                    ),
                                    compareData?.map((item) =>
                                      Number(
                                        item?.test_output_json?.rougel_score
                                      )
                                    ),
                                    compareData?.map((item) =>
                                      Number(
                                        item?.test_output_json?.rougelsum_score
                                      )
                                    ),
                                    selectedModels
                                  )}
                                  xLabel={item?.xLabel}
                                  yLabel={item?.yLabel}
                                />
                              ) : (
                                compareData[0]?.test_output_json?.[
                                  item?.key
                                ] && (
                                  <LineChart
                                    chartData={generateLineData(
                                      compareData,
                                      item?.key,
                                      item?.label,
                                      selectedModels
                                    )}
                                    xLabel={item?.xLabel}
                                    yLabel={item?.yLabel}
                                  />
                                )
                              )}
                            </div>
                          ))}
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

export default CompareModels;
