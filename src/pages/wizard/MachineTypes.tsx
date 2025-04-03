/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../apiconfig';
import { MachineState, SelectedMachines } from '../../types/MachineTypes';
import { ApiErrorResponse } from '../../types/wizardTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../redux/store';
import TableLoader from '../components/TableLoader';
import { updateLoadingState } from '../../redux/wizardSlice';
import { toast } from 'react-toastify';

const MachineTypes: React.FC = () => {
  const navigate = useNavigate();
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const [machineData, setMachineData] = useState<MachineState[]>([]);
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachines[]>(
    []
  );
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchMachineData = async (models: number[]) => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.LOCAL_URL + "models/machines");
        const response = await axios.post(API.API_CB + 'models/machines', {
          llm_ids: [...models],
        });
        const result = await response.data.data;
        setMachineData(result);
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data.message || 'Internal server error');
        dispatch(updateLoadingState(false));
        setMachineData([]);
      }
    };
    if (WizardState.models.length > 0) {
      fetchMachineData(WizardState.models);
    }
  }, [WizardState.models]);

  const handleCheckboxChange = (value: SelectedMachines) => {
    setSelectedMachines((prevSelectedTypes) => {
      const exists = prevSelectedTypes.some(
        (type) =>
          type.llm_id === value.llm_id &&
          type.machine_type_id === value.machine_type_id
      );

      if (exists) {
        return prevSelectedTypes.filter(
          (type) =>
            !(
              type.llm_id === value.llm_id &&
              type.machine_type_id === value.machine_type_id
            )
        );
      } else {
        return [...prevSelectedTypes, value];
      }
    });
  };

  const handleNext = async () => {
    const intitalErrorState = { show: false, message: '' };
    if (selectedMachines.length === 0) {
      // setErrorState({
      //   show: true,
      //   message: "Please selected all the required options ",
      // });
      toast.error('Please select machine type!');
      return;
    }
    try {
      const response = await axios.post(
        API.API_CB + 'infrastructure/node',
        { node_list: [...selectedMachines] },
        {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        }
      );
      await response.data;
      setErrorState({ ...intitalErrorState });
      navigate('/wizard/mission');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('error', error);
      toast.error(
        error.response?.data.message || 'An error occurred. Please try again.'
      );
    }
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
                  <div
                    className="step s4"
                    id="selected-model-screen"
                    style={{ display: 'block' }}
                  >
                    <div className="panel-heading">
                      <h4 className="panel-title">Available Machine Types</h4>
                    </div>
                    <div
                      className="panel-body panel-collapse collapse in"
                      aria-expanded="true"
                    >
                      {machineData?.map((llm) => (
                        <div
                          key={llm?.llm_id}
                          className="row form-group"
                          id="selected-models-wrapper"
                        >
                          <div className="col-sm-12">
                            <h4 className="title mac_title">
                              {llm?.llm_variant_name}
                              <span className="model-title-span">
                                {llm?.llm_family_name}
                              </span>
                            </h4>
                            <div
                              className="model-inner mac_model"
                              data-id="starcoder2-7b"
                              data-table-name="starcoder2-7b"
                            >
                              <div className="table-main-div mac_table_outer">
                                <div
                                  id="starcoder2-7b_wrapper"
                                  className="dataTables_wrapper form-inline no-footer"
                                >
                                  <div className="row">
                                    <div className="col-xs-6"></div>
                                    <div className="col-xs-6"></div>
                                  </div>
                                  <table
                                    className="table table-striped table-hover pb mac_table dataTable no-footer"
                                    data-pid="971"
                                    id="starcoder2-7b"
                                    cellSpacing="0"
                                    width="100%"
                                    role="grid"
                                    style={{ width: '100%' }}
                                  >
                                    <thead>
                                      <tr role="row">
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '41.475px' }}
                                        ></th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '173.688px' }}
                                        >
                                          Machine type
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '96.0375px' }}
                                        >
                                          Hourly
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '101.988px' }}
                                        >
                                          Monthly
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '106.963px' }}
                                        >
                                          Yearly
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '42.275px' }}
                                        >
                                          GPUs
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '112.363px' }}
                                        >
                                          GPU parameters (GiB)
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '50.9375px' }}
                                        >
                                          vCPUs
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '62.1375px' }}
                                        >
                                          Memory (GiB)
                                        </th>
                                        <th
                                          className="sorting_disabled"
                                          rowSpan={1}
                                          colSpan={1}
                                          style={{ width: '30.6375px' }}
                                        >
                                          TPS
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {llm?.available_machine_types?.map(
                                        (machine) => (
                                          <tr
                                            data-id="248_201"
                                            className="machineList odd"
                                            role="row"
                                            key={machine?.machine_type_id}
                                          >
                                            <td className="checkbox-div">
                                              <div className="c-checkbox">
                                                <label>
                                                  <input
                                                    type="checkbox"
                                                    name="mac_checkbox[]"
                                                    className="checkall"
                                                    data-cid="971-248_201"
                                                    onChange={() =>
                                                      handleCheckboxChange({
                                                        machine_type_id:
                                                          machine?.machine_type_id,
                                                        llm_id: llm?.llm_id,
                                                      })
                                                    }
                                                  />
                                                  <span className="fa fa-check"></span>
                                                </label>
                                              </div>
                                            </td>
                                            <td className="">
                                              <a className="">
                                                {machine?.machine_type_name}
                                              </a>
                                            </td>
                                            <td width="10%">{'__'}</td>
                                            <td width="10%">
                                              {
                                                machine?.pricing?.monthly_cost
                                                  ?.value
                                              }
                                            </td>
                                            <td width="10%">
                                              {
                                                machine?.pricing?.yearly_cost
                                                  ?.value
                                              }
                                            </td>
                                            <td>{machine?.gpu?.gpu_type}</td>
                                            <td>
                                              {
                                                machine?.gpu?.gpu_parameters
                                                  ?.value
                                              }
                                            </td>
                                            <td>{machine?.vcpu}</td>
                                            <td>{machine?.memory?.value}</td>
                                            <td>{machine?.tps}</td>
                                          </tr>
                                        )
                                      )}

                                      {/* Add other rows similarly */}
                                    </tbody>
                                  </table>
                                  <div className="row">
                                    <div className="col-xs-6"></div>
                                    <div className="col-xs-6"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {errorState?.show && (
                        <p style={{ color: 'red' }}>{errorState?.message}</p>
                      )}

                      <div className="row">
                        <div className="col-sm-12">
                          <input type="hidden" name="machineSelect" value="" />
                          <div className="pull-right">
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="prev"
                              data-prev-pageid="3"
                              onClick={() => navigate('/wizard/models')}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              onClick={handleNext}
                              data-action="machineSelect"
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

export default MachineTypes;
