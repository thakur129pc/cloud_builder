/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Sidebar from '.././Sidebar';
import { updateLoadingState } from '../../../redux/wizardSlice';
import { useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';
// import { API } from '../../../apiconfig';
import { LlmFamily } from '../../../types/ModelTypes';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../../types/wizardTypes';
import { InferenceMethod, Parameter } from '../../../types/DashboardTypes';
import ParameterModal from './ParameterModel';
import { TestInfo, TestType } from '../../../types/TestTypes';
import { TestMachine } from '../../../types/MachineTypes';

interface InferenceModel {
  llm_id: string;
  is_base: boolean | null;
  inference_name: string;
  inference_description: string;
  inference_method: string;
}

interface Metric {
  metric_name?: string;
  metric_description?: string;
  uom_type?: string;
  uom_name?: string;
  is_range?: boolean;
  fixed_range_value?: string;
  min_range_value?: string;
  max_range_value?: string;
}

interface Test {
  test_id: string;
  test_type_id: string;
  tested_machine_id: string;
  metrics: Metric[];
}

const initialInference = {
  llm_id: '',
  is_base: null,
  inference_name: '',
  inference_description: '',
  inference_method: '',
};

const initialParameters = [
  {
    parameter_name: 'TPS',
    is_new_parameter: false,
    parameter_descryption:
      "The term TPS (A100) likely refers to the number of transactions per second (TPS) that can be processed or supported by an NVIDIA A100 GPU. NVIDIA's A100 Tensor Core GPU is a high-performance computing (HPC) accelerator designed to handle a wide range of compute-intensive workloads, including artificial intelligence (AI), deep learning, data analytics, and scientific simulations.",
  },
  {
    parameter_name: 'Throughput',
    is_new_parameter: false,
    parameter_descryption:
      "Throughput refers to the rate at which a system can process or transfer data, tasks, or transactions within a given period of time. It is a measure of the system's capacity or efficiency in handling workload and is often expressed in units such as bytes per second, transactions per second, or tasks per second.",
  },
  {
    parameter_name: 'Latency',
    is_new_parameter: false,
    parameter_descryption:
      'Latency refers to the time delay between the initiation of a request or task and the completion of the corresponding action or response. It is a measure of the time taken for data to travel from its source to its destination, or for a system to process a given input and produce an output. Latency is often expressed in units of time, such as milliseconds (ms) or microseconds (μs), and is a critical metric in various computing and communication systems.',
  },
];

const InferenceCreate: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const DashboardState = useSelector(
  //   (state: ReduxState) => state.DashboardSlice
  // );
  const readOnly = location.pathname.split('/')[2] ? true : false;
  const inferenceId = location.pathname.split('/')[2] || '';
  // const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const [inferenceMethod, setInferenceMethod] = useState<InferenceMethod[]>([]);
  const [modelsData, setModelsData] = useState<LlmFamily[]>([]);
  const [measurementOptions, setMeasurementOptions] = useState<
    { measurement_type_id: number; type_name: string }[]
  >([]);
  const [uomOptions, setUOMOptions] = useState<
    { uom_id: string; uom_name: number; measurement_type_id: number }[]
  >([]);
  const [parametersData, setParametersData] = useState<Parameter[]>([]);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const [inference, setInference] = useState<InferenceModel>(initialInference);
  const [testData, setTestData] = useState<TestInfo[]>([]);
  const [testTypeList, setTestTypeList] = useState<TestType[]>([]);
  const [machineList, setMachineList] = useState<TestMachine[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tests, setTests] = useState<Test[]>([
    {
      test_id: '',
      test_type_id: '',
      tested_machine_id: '',
      metrics: [],
    }, // Initial Test (Test 1)
  ]);
  const [maxTests, setMaxTests] = useState<number>(1);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);

  const MOCK_API_BASE = 'http://localhost:8000';

  useEffect(() => {
    const fetchInferenceMethod = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(
        //   API.API_CB + 'admin/inference-method',
        //   {
        //     headers: {
        //       Authorization: `Bearer ${authObj.access_token}`,
        //     },
        //   }
        // );
        // const response = await axios.get(API.LOCAL_URL + "models");
        // const data = await response.data?.data;
        const response = await axios.get(
          `${MOCK_API_BASE}/inference-method_in`
        );
        const data: InferenceMethod[] = response.data;
        setInferenceMethod(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setInferenceMethod([]);
        dispatch(updateLoadingState(false));
      }
    };

    const fetchModels = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'models');
        // const data: LlmFamily[] = await response.data?.data;
        const response = await axios.get(`${MOCK_API_BASE}/models_in`);
        const data: LlmFamily[] = response.data;
        setModelsData(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setModelsData([]);
      }
    };

    const fetchParameters = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'parameters');
        // const data = response?.data?.data;
        const response = await axios.get(`${MOCK_API_BASE}/parameters_in`);
        const data: Parameter[] = response.data;
        setParametersData(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setParametersData(initialParameters);
      }
    };

    const fetchMeasurementTypes = async () => {
      try {
        // const response = await axios.get(
        //   API.API_CB + 'admin/measurement-type',
        //   {
        //     headers: { Authorization: `Bearer ${authObj.access_token}` },
        //   }
        // );
        // const data = response?.data?.data;
        const response = await axios.get(
          `${MOCK_API_BASE}/measurement-type_in`
        );
        const data = response.data;
        setMeasurementOptions(data);
      } catch (error) {
        setMeasurementOptions([]);
      }
    };

    const fetchMeasurementUOM = async () => {
      try {
        // const response = await axios.get(
        //   API.API_CB + 'admin/units-of-measure',
        //   {
        //     headers: { Authorization: `Bearer ${authObj.access_token}` },
        //   }
        // );
        // const data = response?.data?.data;
        const response = await axios.get(
          `${MOCK_API_BASE}/units-of-measure_in`
        );
        const data = response.data;
        setUOMOptions(data);
      } catch (error) {
        setUOMOptions([]);
      }
    };

    const fetchTests = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'admin/test', {
        //   headers: { Authorization: `Bearer ${authObj.access_token}` },
        // });
        // const data = response?.data?.data;
        const response = await axios.get(`${MOCK_API_BASE}/test_in`);
        const data: TestInfo[] = response.data;
        setTestData(data);
        setMaxTests(data.length);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setTestData([]);
        dispatch(updateLoadingState(false));
      }
    };

    const fetchTestTypes = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'admin/test-type', {
        //   headers: {
        //     Authorization: `Bearer ${authObj?.access_token}`,
        //   },
        // });
        // const data = await response?.data?.data;
        const response = await axios.get(`${MOCK_API_BASE}/test-type_in`);
        const data: TestType[] = response.data;
        setTestTypeList(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setTestTypeList([]);
        dispatch(updateLoadingState(false));
      }
    };

    const fetchTestMachines = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'admin/test-machine', {
        //   headers: {
        //     Authorization: `Bearer ${authObj?.access_token}`,
        //   },
        // });
        // const data = await response.data?.data;
        const response = await axios.get(`${MOCK_API_BASE}/test-machine_in`);
        const data: TestMachine[] = response.data;
        setMachineList(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setMachineList([]);
        dispatch(updateLoadingState(false));
      }
    };

    fetchInferenceMethod();
    fetchModels();
    fetchParameters();
    fetchMeasurementTypes();
    fetchMeasurementUOM();
    fetchTests();
    fetchTestTypes();
    fetchTestMachines();
  }, []);

  useEffect(() => {
    const fetchInferenceDetails = async () => {
      try {
        if (readOnly && inferenceId) {
          // Fetch inference details from the mock API
          const response = await axios.get(
            `${MOCK_API_BASE}/inferences_in/${inferenceId}`
          );

          const inferenceDetails = response.data;

          // Map the fetched data to the state variables
          const localInference = {
            llm_id: inferenceDetails.llm_id.toString(),
            is_base: inferenceDetails.is_base,
            inference_name: inferenceDetails.inference_name,
            inference_description: inferenceDetails.inference_description,
            inference_method: inferenceDetails.inference_method_id.toString(),
          };

          const localParameters = inferenceDetails.inference_parameters.map(
            (param: Parameter) => ({
              parameter_name: param.parameter_name,
              is_new_parameter: param.is_new_parameter,
              parameter_descryption: param.parameter_descryption,
              measurement_type_id: param.measurement_type_id,
              uom_id: param.uom_id,
              is_range: param.is_range,
              fixed_range_value: param.fixed_range_value || '',
              min_range_value: param.min_range_value || '',
              max_range_value: param.max_range_value || '',
            })
          );

          const localTests = inferenceDetails.inference_tests.map(
            (test: Test) => ({
              test_id: test.test_id,
              test_type_id: test.test_type_id,
              tested_machine_id: test.tested_machine_id,
              metrics: test.metrics.map((metric: Metric) => ({
                metric_name: metric.metric_name,
                metric_description: metric.metric_description,
                uom_type: metric.uom_type,
                uom_name: metric.uom_name,
                is_range: !!metric.is_range,
                fixed_range_value: metric.fixed_range_value || '',
                min_range_value: metric.min_range_value || '',
                max_range_value: metric.max_range_value || '',
              })),
            })
          );

          // Set the state variables
          setInference(localInference);
          setParametersData(localParameters);
          setTests(localTests);
        } else {
          // Reset to initial state if not in read-only mode
          setInference(initialInference);
          setParametersData([]);
          setTests([
            {
              test_id: '',
              test_type_id: '',
              tested_machine_id: '',
              metrics: [],
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching inference details:', error);
        toast.error('Failed to fetch inference details');
      }
    };

    fetchInferenceDetails();
  }, [inferenceId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setInference({ ...inference, [name]: value });
  };

  const handleAddParameter = async (newParameter: Parameter) => {
    // setParametersData([...parametersData, newParameter]);
    try {
      // Save new parameter to mock API
      const response = await axios.post(
        `${MOCK_API_BASE}/parameters_in`,
        newParameter
      );
      setParametersData([...parametersData, response.data]);
      toast.success('Parameter added successfully');
    } catch (error) {
      toast.error('Error adding parameter');
    }
  };

  const removeParameter = (index: number) => {
    setParametersData(parametersData.filter((_, i) => i !== index));
  };

  const handleAddTest = () => {
    if (tests.length < maxTests) {
      setTests([
        ...tests,
        { test_id: '', test_type_id: '', tested_machine_id: '', metrics: [] },
      ]);
    } else {
      toast.error(`You can only add up to ${maxTests} tests.`);
    }
  };

  const handleDeleteTest = (index: number) => {
    if (tests.length > 1) {
      const deletedTestId = tests[index].test_id; // Get the test ID of the deleted test
      setTests(tests.filter((_, i) => i !== index));

      // Remove the deleted test ID from the selectedTestIds state
      setSelectedTestIds((prevSelectedTestIds) =>
        prevSelectedTestIds.filter((id) => id !== deletedTestId)
      );
    } else {
      toast.error('You must have at least one test.');
    }
  };

  const handleTestChange = async (
    index: number,
    field: keyof Test,
    value: string
  ) => {
    const updatedTests = [...tests];

    if (field === 'metrics') {
      return;
    }

    // If the field is 'test_id', update the selectedTestIds state
    if (field === 'test_id') {
      const previousTestId = updatedTests[index].test_id; // Get the previous test ID
      updatedTests[index][field] = value;

      // const testDetails = await fetchTestDetails(value);
      // Filter the test from the testData array using the testId
      const testDetails = testData.find(
        (test) => test.test_id === Number(value)
      );
      if (testDetails?.metrics) {
        // Map the metrics details to the updatedTests array
        updatedTests[index].metrics = testDetails.metrics.map(
          (metric: Metric) => ({
            metric_name: metric.metric_name || '',
            metric_description: metric.metric_description || '',
            uom_type: metric.uom_type || '',
            uom_name: metric.uom_name || '',
            is_range: metric.is_range,
            fixed_range_value: metric.fixed_range_value || '',
            min_range_value: metric.min_range_value || '',
            max_range_value: metric.max_range_value || '',
          })
        );
      }

      // Update the selectedTestIds state
      setSelectedTestIds((prevSelectedTestIds) => {
        const updatedSelectedTestIds = [...prevSelectedTestIds];

        // Remove the previous test ID from the selected list
        if (previousTestId) {
          const indexToRemove = updatedSelectedTestIds.indexOf(previousTestId);
          if (indexToRemove > -1) {
            updatedSelectedTestIds.splice(indexToRemove, 1);
          }
        }

        // Add the new test ID to the selected list
        if (value) {
          updatedSelectedTestIds.push(value);
        }

        return updatedSelectedTestIds;
      });
    } else {
      updatedTests[index][field] = value;
    }

    setTests(updatedTests);
  };

  // const fetchTestDetails = async (testId: string) => {
  //   try {
  //     const response = await axios.get(
  //       API.API_CB + `admin/test-detail/${testId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authObj?.access_token}`,
  //         },
  //       }
  //     );
  //     return response.data?.data;
  //   } catch (error) {
  //     toast.error('Error fetching test metric details');
  //   }
  // };

  const handleSave = async () => {
    try {
      // Validate inference
      if (!inference.llm_id) {
        toast.error('Model is required');
        return;
      }
      if (inference.is_base === null) {
        toast.error('Please select base');
        return;
      }
      if (inference.is_base === false) {
        if (!inference.inference_name.trim()) {
          toast.error('Inference name is required');
          return;
        }
        if (!inference.inference_description.trim()) {
          toast.error('Inference descryption is required');
          return;
        }
        if (!inference.inference_method.trim()) {
          toast.error('Inference method is required');
          return;
        }
      }

      // Validate parameters
      if (!parametersData || parametersData.length === 0) {
        toast.error('At least one parameter is required');
        return;
      }

      for (const parameter of parametersData) {
        if (!parameter.parameter_name) {
          toast.error('Parameter name is required');
          return;
        }
        if (parameter.is_range === undefined || parameter.is_range === null) {
          toast.error(
            `Please select range for parameter: ${parameter.parameter_name}`
          );
          return;
        }
        if (!parameter.parameter_name) {
          toast.error('Parameter name is required');
          return;
        }
        if (parameter.is_range === false) {
          if (!parameter.fixed_range_value) {
            toast.error(
              `Fixed range value is required for parameter: ${parameter.parameter_name}`
            );
            return;
          }
        } else if (parameter.is_range === true) {
          if (!parameter.min_range_value || !parameter.max_range_value) {
            toast.error(
              `Min and Max range values are required for parameter: ${parameter.parameter_name}`
            );
            return;
          }
        }
        if (!parameter.measurement_type_id) {
          toast.error(
            `Measurement type is required for parameter: ${parameter.parameter_name}`
          );
          return;
        }
        if (!parameter.uom_id) {
          toast.error(
            `Unit of Measure (UOM) is required for parameter: ${parameter.parameter_name}`
          );
          return;
        }
      }

      // Validate tests
      if (!tests || tests.length === 0) {
        toast.error('At least one test is required');
        return;
      }

      for (const [index, test] of tests.entries()) {
        if (!test.test_id) {
          toast.error(`Test is required for Test ${index + 1}`);
          return;
        }
        if (!test.test_type_id) {
          toast.error(`Test Type is required for Test ${index + 1}`);
          return;
        }
        if (!test.tested_machine_id) {
          toast.error(`Tested on Machine is required for Test ${index + 1}`);
          return;
        }

        // Validate metrics inside the test
        for (const [metricIndex, metric] of test.metrics.entries()) {
          if (metric.is_range === undefined || metric.is_range === null) {
            toast.error(
              `Please select range for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
            );
            return;
          }
          if (metric.is_range === true) {
            if (!metric.min_range_value || !metric.max_range_value) {
              toast.error(
                `Min and Max range values are required for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
              );
              return;
            }
          } else if (metric.is_range === false) {
            if (!metric.fixed_range_value) {
              toast.error(
                `Fixed range value is required for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
              );
              return;
            }
          }
        }
      }

      dispatch(updateLoadingState(true));
      // const response = await axios.post(
      //   API.API_CB + 'admin/inference',
      //   {
      //     llm_id: Number(inference.llm_id),
      //     is_base: inference.is_base,
      //     inference_name: inference.inference_name,
      //     inference_description: inference.inference_description || '',
      //     inference_method_id: Number(inference.inference_method),
      //     inference_parameters: parametersData,
      //     inference_tests: tests,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authObj.access_token}`,
      //     },
      //   }
      // );
      // await response.data;
      // Save inference to mock API
      const response = await axios.get(`http://localhost:8000/inferences_in`);
      const id = response.data.length + 1;
      await axios.post(`${MOCK_API_BASE}/inferences_in`, {
        id: id.toString(),
        llm_id: Number(inference.llm_id),
        is_base: inference.is_base,
        inference_name: inference.inference_name,
        inference_description: inference.inference_description || '',
        inference_method_id: Number(inference.inference_method),
        inference_parameters: parametersData,
        inference_tests: tests,
      });
      toast.success('Inference saved successfully');
      navigate('/inference');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while creating the inference'
      );
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate inference
      if (!inference.llm_id) {
        toast.error('Model is required');
        return;
      }
      if (inference.is_base === null) {
        toast.error('Please select base');
        return;
      }
      if (inference.is_base === false) {
        if (!inference.inference_name.trim()) {
          toast.error('Inference name is required');
          return;
        }
        if (!inference.inference_description.trim()) {
          toast.error('Inference descryption is required');
          return;
        }
        if (!inference.inference_method.trim()) {
          toast.error('Inference method is required');
          return;
        }
      }

      // Validate parameters
      if (!parametersData || parametersData.length === 0) {
        toast.error('At least one parameter is required');
        return;
      }

      for (const parameter of parametersData) {
        if (!parameter.parameter_name) {
          toast.error('Parameter name is required');
          return;
        }
        if (parameter.is_range === undefined || parameter.is_range === null) {
          toast.error(
            `Please select range for parameter: ${parameter.parameter_name}`
          );
          return;
        }
        if (parameter.is_range === false) {
          if (!parameter.fixed_range_value) {
            toast.error(
              `Fixed range value is required for parameter: ${parameter.parameter_name}`
            );
            return;
          }
        } else if (parameter.is_range === true) {
          if (!parameter.min_range_value || !parameter.max_range_value) {
            toast.error(
              `Min and Max range values are required for parameter: ${parameter.parameter_name}`
            );
            return;
          }
        }
        if (!parameter.measurement_type_id) {
          toast.error(
            `Measurement type is required for parameter: ${parameter.parameter_name}`
          );
          return;
        }
        if (!parameter.uom_id) {
          toast.error(
            `Unit of Measure (UOM) is required for parameter: ${parameter.parameter_name}`
          );
          return;
        }
      }

      // Validate tests
      if (!tests || tests.length === 0) {
        toast.error('At least one test is required');
        return;
      }

      for (const [index, test] of tests.entries()) {
        if (!test.test_id) {
          toast.error(`Test is required for Test ${index + 1}`);
          return;
        }
        if (!test.test_type_id) {
          toast.error(`Test Type is required for Test ${index + 1}`);
          return;
        }
        if (!test.tested_machine_id) {
          toast.error(`Tested on Machine is required for Test ${index + 1}`);
          return;
        }

        // Validate metrics inside the test
        for (const [metricIndex, metric] of test.metrics.entries()) {
          if (metric.is_range === undefined || metric.is_range === null) {
            toast.error(
              `Please select range for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
            );
            return;
          }
          if (metric.is_range === true) {
            if (!metric.min_range_value || !metric.max_range_value) {
              toast.error(
                `Min and Max range values are required for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
              );
              return;
            }
          } else if (metric.is_range === false) {
            if (!metric.fixed_range_value) {
              toast.error(
                `Fixed range value is required for Metric ${metric.metric_name || `#${metricIndex + 1}`} in Test ${index + 1}`
              );
              return;
            }
          }
        }
      }

      dispatch(updateLoadingState(true));
      // const response = await axios.put(
      //   API.API_CB + 'admin/inference/' + inferenceId,
      //   {
      //     llm_id: Number(inference.llm_id),
      //     is_base: inference.is_base,
      //     inference_name: inference.inference_name,
      //     inference_description: inference.inference_description || '',
      //     inference_method: Number(inference.inference_method),
      //     inference_parameters: parametersData,
      //     inference_tests: tests,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authObj.access_token}`,
      //     },
      //   }
      // );
      // await response.data;
      // Update inference in mock API
      await axios.put(`${MOCK_API_BASE}/inferences_in/${inferenceId}`, {
        llm_id: Number(inference.llm_id),
        is_base: inference.is_base,
        inference_name: inference.inference_name,
        inference_description: inference.inference_description || '',
        inference_method: Number(inference.inference_method),
        inference_parameters: parametersData,
        inference_tests: tests,
      });
      toast.success('Inference updated successfully');
      navigate('/inference');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(
        error.response?.data.message ||
          'An error occurred while updating the inference'
      );
    }
  };

  return (
    <div className="wrapper dashboard-main">
      <header className="topnavbar-wrapper">
        {/* Top Navbar*/}
        <nav role="navigation" className="navbar topnavbar">
          {/* Navbar Header*/}
          <div className="user-section">
            <h2 className="logo-title">Rokket AI</h2>
          </div>
          <div className="sec-title">
            <h3 className="sec_title_tag" data-picklistid="">
              {' '}
              Inference Create{' '}
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
            </ul>
          </div>
        </nav>
      </header>
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
                  Inference
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
                          if (inferenceId) {
                            handleUpdate();
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
                  <div className="col-sm-12">
                    <div className="row form-group">
                      <div className="col-sm-2">
                        <label className="labels"> Model Family: </label>
                      </div>
                      <div className="col-sm-6 chosen-order">
                        <select
                          id="modelSelect"
                          value={inference.llm_id}
                          disabled={readOnly && !isEditing}
                          name="llm_id"
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            Select model
                          </option>
                          {modelsData.map((model) => (
                            <option
                              key={model.llm_family_id}
                              value={model.llm_family_id}
                            >
                              {model.llm_family}
                            </option>
                          ))}
                        </select>
                        <div
                          className="chosen-container chosen-container-single chosen-container-single-nosearch"
                          style={{ width: 600 }}
                          title=""
                        >
                          <div className="chosen-drop">
                            <div className="chosen-search">
                              <input type="text" autoComplete="off" />
                            </div>
                            <ul className="chosen-results" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-sm-2">
                        <label className="labels"> Base: </label>
                      </div>
                      <div className="col-sm-6">
                        <div className="radio c-radio col-sm-3 m0">
                          <label>
                            <input
                              type="radio"
                              disabled={readOnly && !isEditing}
                              className="channel-type"
                              name="is_base"
                              checked={inference.is_base || false}
                              onChange={() => {
                                setInference({
                                  ...inference,
                                  is_base: true,
                                  inference_name: '',
                                  inference_description: '',
                                  inference_method: '',
                                });
                              }}
                            />{' '}
                            <span className="fa fa-circle" /> Yes
                          </label>
                        </div>
                        <div className="radio c-radio col-sm-3 m0">
                          <label>
                            <input
                              type="radio"
                              disabled={readOnly && !isEditing}
                              className="channel-type"
                              name="is_base"
                              checked={inference.is_base === false || false}
                              onChange={() => {
                                setInference({
                                  ...inference,
                                  is_base: false,
                                });
                              }}
                              data-parsley-multiple="channel-type"
                            />{' '}
                            <span className="fa fa-circle" /> No
                          </label>
                        </div>
                      </div>
                    </div>
                    {!inference.is_base && (
                      <div className="base-fields-outer">
                        <div className="row form-group">
                          <div className="col-sm-2">
                            <label className="labels">
                              {' '}
                              Base Name Extension:{' '}
                            </label>
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              disabled={readOnly && !isEditing}
                              data-sentence-case="true"
                              name="base_extension"
                              value={inference.inference_name}
                              onChange={(e) => {
                                setInference({
                                  ...inference,
                                  inference_name: e.target.value,
                                });
                              }}
                              data-parsley-error-message="Enter base name extension"
                              placeholder="Enter base name extension"
                              className="form-control"
                              maxLength={255}
                              data-parsley-id={11}
                            />
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-sm-2">
                            <label className="labels">
                              {' '}
                              Inference Method:{' '}
                            </label>
                          </div>
                          <div className="col-sm-6 chosen-order">
                            <select
                              id="modelSelect"
                              value={inference.inference_method}
                              name="inference_method"
                              disabled={readOnly && !isEditing}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value="" disabled>
                                Select Inference Method
                              </option>
                              {inferenceMethod.map((model) => (
                                <option
                                  key={model.inference_method_id}
                                  value={model.inference_method_id}
                                >
                                  {model.name}
                                </option>
                              ))}
                            </select>
                            <div
                              className="chosen-container chosen-container-single chosen-container-single-nosearch"
                              style={{ width: 600 }}
                              title=""
                            >
                              <div className="chosen-drop">
                                <div className="chosen-search">
                                  <input type="text" autoComplete="off" />
                                </div>
                                <ul className="chosen-results" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row form-group">
                          <div className="col-sm-12">
                            <label htmlFor="description" className="labels">
                              {' '}
                              Inference Description:
                            </label>
                            <textarea
                              name="description"
                              data-sentence-case="true"
                              value={inference.inference_description}
                              onChange={(e) => {
                                setInference({
                                  ...inference,
                                  inference_description: e.target.value,
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                  PARAMETERS
                  {!(readOnly && !isEditing) && (
                    <div className="pull-right">
                      <button
                        type="button"
                        className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                        id="add-metric-btn"
                        onClick={() => setShowParameterModal(true)}
                        disabled={readOnly && !isEditing}
                      >
                        {' '}
                        Add Parameter{' '}
                      </button>
                    </div>
                  )}
                </h4>
              </div>
              <div
                className="panel-body panel-collapse collapse in"
                aria-expanded="true"
              >
                <div>
                  {parametersData?.map((parameter, index) => (
                    <div
                      key={index}
                      className="metrics-wrapper form-group"
                      style={{
                        padding: '5px',
                        position: 'relative',
                      }}
                    >
                      {parameter.is_new_parameter &&
                        ((readOnly && isEditing) || !readOnly) && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '50%',
                              backgroundColor: 'red',
                              color: 'white',
                              fontSize: '16px',
                              cursor: 'pointer',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                              zIndex: '100',
                              fontWeight: 'bolder',
                            }}
                            onClick={() => removeParameter(index)}
                            title="Remove"
                          >
                            &times; {/* Unicode for a cross symbol */}
                          </div>
                        )}
                      <div className="row form-group measurement-type-wrapper">
                        <div className="col-sm-2 chosen-order">
                          <label className="labels">
                            {parameter.parameter_name}:
                            <span
                              className="info-icon"
                              data-tooltip={parameter.parameter_descryption}
                            >
                              <i className="fa fa-info-circle" />
                            </span>
                          </label>
                        </div>
                        <div className="col-sm-2 chosen-order">
                          <label
                            htmlFor={`measurement_type_${index}`}
                            className="labels"
                          >
                            Measurement Type
                          </label>
                          <select
                            className="form-control chosen-select"
                            id={`measurement_type_${index}`}
                            name={`measurement_type_${index}`}
                            disabled={readOnly && !isEditing}
                            value={parameter.measurement_type_id || ''}
                            onChange={(e) => {
                              const newParameterData = [...parametersData];
                              newParameterData[index].measurement_type_id =
                                Number(e.target.value);
                              newParameterData[index].uom_id = undefined;
                              setParametersData(newParameterData);
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
                        <div className="col-sm-2 chosen-order">
                          <label htmlFor={`uom_${index}`} className="labels">
                            Measurement UOM
                          </label>
                          <select
                            className="form-control chosen-select"
                            id={`uom_${index}`}
                            name={`uom_${index}`}
                            disabled={
                              (readOnly && !isEditing) ||
                              !parameter.measurement_type_id
                            }
                            value={parameter.uom_id || ''}
                            onChange={(e) => {
                              const newParameterData = [...parametersData];
                              newParameterData[index].uom_id = Number(
                                e.target.value
                              );
                              setParametersData(newParameterData);
                            }}
                          >
                            <option value="" disabled>
                              Select UOM
                            </option>
                            {uomOptions
                              .filter(
                                (uom) =>
                                  uom.measurement_type_id ===
                                  +(parameter?.measurement_type_id ?? 0)
                              ) // Filter UOMs based on uom_type
                              .map((uom) => (
                                <option key={uom.uom_id} value={uom.uom_id}>
                                  {uom.uom_name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="col-sm-2">
                          <label htmlFor={`range_${index}`} className="labels">
                            Range
                          </label>
                          <div
                            className="row"
                            style={{ display: 'flex', gap: '15px' }}
                          >
                            <div className="radio c-radio m0 col-4">
                              <label>
                                <input
                                  type="radio"
                                  checked={parameter.is_range || false}
                                  onChange={() => {
                                    const newParameterData = [
                                      ...parametersData,
                                    ];
                                    newParameterData[index].is_range = true;
                                    delete newParameterData[index]
                                      .fixed_range_value;
                                    setParametersData(newParameterData);
                                  }}
                                  className="channel-type measured"
                                  name={`range_${index}`}
                                  disabled={readOnly && !isEditing}
                                />
                                <span className="fa fa-circle" /> Yes
                              </label>
                            </div>
                            <div className="radio c-radio m0 col-4">
                              <label>
                                <input
                                  type="radio"
                                  className="channel-type measured"
                                  checked={parameter.is_range === false}
                                  onChange={() => {
                                    const newParameterData = [
                                      ...parametersData,
                                    ];
                                    newParameterData[index].is_range = false;
                                    delete newParameterData[index]
                                      .min_range_value;
                                    delete newParameterData[index]
                                      .max_range_value;
                                    setParametersData(newParameterData);
                                  }}
                                  disabled={readOnly && !isEditing}
                                  name={`range_${index}`}
                                />
                                <span className="fa fa-circle" /> No
                              </label>
                            </div>
                          </div>
                        </div>
                        {parameter.is_range === true && (
                          <div className="col-sm-4 row">
                            <div className="col-sm-6">
                              <label className="labels">Min Range</label>
                              <div className="">
                                <input
                                  type="text"
                                  disabled={readOnly && !isEditing}
                                  data-sentence-case="true"
                                  name="min_range_value"
                                  value={parameter.min_range_value}
                                  onChange={(e) => {
                                    const newParameterData = [
                                      ...parametersData,
                                    ];
                                    newParameterData[index].min_range_value =
                                      e.target.value;
                                    setParametersData(newParameterData);
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
                                  value={parameter.max_range_value}
                                  onChange={(e) => {
                                    const newParameterData = [
                                      ...parametersData,
                                    ];
                                    newParameterData[index].max_range_value =
                                      e.target.value;
                                    setParametersData(newParameterData);
                                  }}
                                  placeholder="Enter Max Range"
                                  className="form-control"
                                  maxLength={255}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {parameter.is_range === false && (
                          <div className="col-sm-4 row">
                            <div className="col-sm-6">
                              <label className="labels">Fixed Range</label>
                              <div className="">
                                <input
                                  type="text"
                                  disabled={readOnly && !isEditing}
                                  data-sentence-case="true"
                                  name="fixed_range_value"
                                  value={parameter.fixed_range_value}
                                  onChange={(e) => {
                                    const newParameterData = [
                                      ...parametersData,
                                    ];
                                    newParameterData[index].fixed_range_value =
                                      e.target.value;
                                    setParametersData(newParameterData);
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
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title" style={{ paddingBottom: '10px' }}>
                  TEST
                  {!(readOnly && !isEditing) && (
                    <div className="pull-right">
                      <button
                        type="button"
                        className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
                        onClick={handleAddTest}
                        disabled={readOnly && !isEditing}
                      >
                        Add Test
                      </button>
                    </div>
                  )}
                </h4>
              </div>
              <div
                className="panel-body panel-collapse collapse in"
                aria-expanded="true"
              >
                <ul className="nav nav-tabs">
                  {tests.map((_, index) => (
                    <li
                      key={index}
                      className={index === tests.length - 1 ? 'active' : ''}
                    >
                      <a href={`#test_${index + 1}`} data-toggle="tab">
                        Test {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="tab-content">
                  {tests.map((test, index) => (
                    <div
                      key={index}
                      className={`tab-pane ${index === tests.length - 1 ? 'active' : ''}`}
                      id={`test_${index + 1}`}
                      style={{
                        position: 'relative',
                      }}
                    >
                      <div className="row form-group">
                        <div className="col-sm-2">
                          <label className="labels">Test:</label>
                        </div>
                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            value={test.test_id}
                            onChange={(e) =>
                              handleTestChange(index, 'test_id', e.target.value)
                            }
                            disabled={readOnly && !isEditing}
                          >
                            <option value="" disabled>
                              Select test
                            </option>
                            {testData
                              .filter(
                                (option) =>
                                  !selectedTestIds.includes(
                                    option.test_id.toString()
                                  ) ||
                                  option.test_id.toString() === test.test_id
                              )
                              .map((option) => (
                                <option
                                  key={option.test_id}
                                  value={option.test_id}
                                >
                                  {option.test_name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-sm-2">
                          <label className="labels">Test Type:</label>
                        </div>
                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            value={test.test_type_id}
                            onChange={(e) =>
                              handleTestChange(
                                index,
                                'test_type_id',
                                e.target.value
                              )
                            }
                            disabled={readOnly && !isEditing}
                          >
                            <option value="" disabled>
                              Select test type
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
                          <label className="labels">Tested on Machine:</label>
                        </div>
                        <div className="col-sm-6">
                          <select
                            className="form-control"
                            value={test.tested_machine_id}
                            onChange={(e) =>
                              handleTestChange(
                                index,
                                'tested_machine_id',
                                e.target.value
                              )
                            }
                            disabled={readOnly && !isEditing}
                          >
                            <option value="" disabled>
                              Select machine
                            </option>
                            {machineList.map((option) => (
                              <option
                                key={option.test_machine_id}
                                value={option.test_machine_id}
                              >
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {index === tests.length - 1 &&
                        tests.length > 1 &&
                        ((readOnly && isEditing) || !readOnly) && (
                          <div
                            className="row form-group"
                            style={{
                              position: 'absolute',
                              top: '0px',
                              right: '1px',
                            }}
                          >
                            <div className="col-sm-12">
                              <button
                                type="button"
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDeleteTest(index)}
                                disabled={readOnly && !isEditing}
                              >
                                Delete Test
                              </button>
                            </div>
                          </div>
                        )}

                      {/* Conditionally render Metrics & Results section */}
                      {test.test_id && (
                        <div className="metrics-results-section">
                          <h4>Metrics & Results</h4>
                          <div className="metrics-box">
                            <div className="row form-group">
                              <div className="col-sm-2">
                                <label className="labels">Metrics Name:</label>
                              </div>
                              <div className="col-sm-2">
                                <label className="labels">
                                  Measurement Type:
                                </label>
                              </div>
                              <div className="col-sm-2">
                                <label className="labels">
                                  Measurement UOM:
                                </label>
                              </div>
                              <div className="col-sm-2">
                                <label className="labels">Range:</label>
                              </div>
                            </div>
                            {test.metrics.map((metric, metricIndex) => (
                              <div className="row form-group" key={metricIndex}>
                                <div className="col-sm-2 chosen-order">
                                  <label
                                    className="labels"
                                    style={{ color: '#bdbcbc' }}
                                  >
                                    {metric.metric_name}
                                    <span
                                      className="info-icon"
                                      data-tooltip={metric.metric_description}
                                    >
                                      <i className="fa fa-info-circle" />
                                    </span>
                                  </label>
                                </div>
                                <div className="col-sm-2 chosen-order">
                                  <input
                                    type="text"
                                    value={metric.uom_type || 'N/A'}
                                    placeholder="Measurement type"
                                    className="form-control"
                                    style={{ borderRadius: '0px' }}
                                    disabled
                                  />
                                </div>
                                <div className="col-sm-2 chosen-order">
                                  <input
                                    type="text"
                                    value={metric.uom_name || 'N/A'}
                                    placeholder="Measurement UOM"
                                    className="form-control"
                                    style={{ borderRadius: '0px' }}
                                    disabled
                                  />
                                </div>
                                <div className="col-sm-2">
                                  <div
                                    className="row"
                                    style={{ display: 'flex', gap: '15px' }}
                                  >
                                    <div className="radio c-radio m0 col-4">
                                      <label>
                                        <input
                                          type="radio"
                                          checked={metric.is_range === true}
                                          onChange={() => {
                                            const updatedTests = [...tests];
                                            updatedTests[index].metrics[
                                              metricIndex
                                            ] = {
                                              ...updatedTests[index].metrics[
                                                metricIndex
                                              ],
                                              is_range: true,
                                              fixed_range_value: undefined, // Clear fixed range value
                                            };
                                            setTests(updatedTests);
                                          }}
                                          className="channel-type measured"
                                          name={`range_${metricIndex}`}
                                          disabled={readOnly && !isEditing}
                                        />
                                        <span className="fa fa-circle" /> Yes
                                      </label>
                                    </div>
                                    <div className="radio c-radio m0 col-4">
                                      <label>
                                        <input
                                          type="radio"
                                          className="channel-type measured"
                                          checked={metric.is_range === false}
                                          onChange={() => {
                                            const updatedTests = [...tests];
                                            updatedTests[index].metrics[
                                              metricIndex
                                            ] = {
                                              ...updatedTests[index].metrics[
                                                metricIndex
                                              ],
                                              is_range: false,
                                              min_range_value: undefined, // Clear min range value
                                              max_range_value: undefined, // Clear max range value
                                            };
                                            setTests(updatedTests);
                                          }}
                                          disabled={readOnly && !isEditing}
                                          name={`range_${metricIndex}`}
                                        />
                                        <span className="fa fa-circle" /> No
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                {metric.is_range === true && (
                                  <div className="col-sm-4 row">
                                    <div className="col-sm-6">
                                      <div className="">
                                        <input
                                          type="text"
                                          disabled={readOnly && !isEditing}
                                          data-sentence-case="true"
                                          name="min_range_value"
                                          value={metric.min_range_value}
                                          onChange={(e) => {
                                            const updatedTests = [...tests];
                                            updatedTests[index].metrics[
                                              metricIndex
                                            ].min_range_value = e.target.value;
                                            setTests(updatedTests);
                                          }}
                                          placeholder="Enter Min Range"
                                          className="form-control"
                                          maxLength={255}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-sm-6">
                                      <div className="">
                                        <input
                                          type="text"
                                          disabled={readOnly && !isEditing}
                                          data-sentence-case="true"
                                          name="max_range_value"
                                          value={metric.max_range_value}
                                          onChange={(e) => {
                                            const updatedTests = [...tests];
                                            updatedTests[index].metrics[
                                              metricIndex
                                            ].max_range_value = e.target.value;
                                            setTests(updatedTests);
                                          }}
                                          placeholder="Enter Max Range"
                                          className="form-control"
                                          maxLength={255}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {metric.is_range === false && (
                                  <div className="col-sm-4 row">
                                    <div className="col-sm-6">
                                      <div className="">
                                        <input
                                          type="text"
                                          disabled={readOnly && !isEditing}
                                          data-sentence-case="true"
                                          name="fixed_range_value"
                                          value={metric.fixed_range_value}
                                          onChange={(e) => {
                                            const updatedTests = [...tests];
                                            updatedTests[index].metrics[
                                              metricIndex
                                            ].fixed_range_value =
                                              e.target.value;
                                            setTests(updatedTests);
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
                            ))}
                          </div>
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
      {showParameterModal && (
        <ParameterModal
          visible={showParameterModal}
          onClose={() => setShowParameterModal(false)}
          onSave={handleAddParameter}
        />
      )}
    </div>
  );
};

export default InferenceCreate;
