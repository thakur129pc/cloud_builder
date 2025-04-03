/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, ReduxState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoadingState } from '../../redux/wizardSlice';
import axios, { AxiosError } from 'axios';
import { BOM, BomApiRes, CostState } from '../../types/CostsTypes';
import { SelectedMachines } from '../../types/MachineTypes';
import TableLoader from '../components/TableLoader';
import { toast } from 'react-toastify';
import { ApiErrorResponse } from '../../types/wizardTypes';
import { API } from '../../apiconfig';

type HideState = {
  sbom: boolean[];
  model: boolean[];
  bom: boolean[];
};

interface BomProp {
  item: BOM;
  index: number;
}

const Costs: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);

  const [costState, setCostState] = useState<CostState>({
    models: [],
    cost: null,
  });

  const [filteredData, setFilteredData] = useState<CostState>({
    models: [],
    cost: null,
  });

  const [hideState, setHideState] = useState<HideState>({
    bom: [],
    sbom: [],
    model: [],
  });

  useEffect(() => {
    const initState = { models: [], cost: null };

    const fetchTaskTypes = async (
      selectedMachines: SelectedMachines[],
      toolkitoption_ids: number[]
    ) => {
      try {
        dispatch(updateLoadingState(true));
        const [costResponse, bomResponse] = await Promise.allSettled([
          axios.post(API.API_CB + 'projected-costs', {
            node_list: selectedMachines,
          }),
          axios.post(API.API_CB + 'bom', {
            toolkitoption_ids,
          }),
        ]);

        const newCostState = { ...costState };

        if (costResponse.status === 'fulfilled') {
          newCostState.models = costResponse.value.data.data;
        }
        if (bomResponse.status === 'fulfilled') {
          const bomData: BomApiRes = bomResponse.value.data.data;
          bomData.sbom = bomData.bom.filter(
            (item) => item.system_type == 'software'
          );
          bomData.bom = bomData.bom.filter(
            (item) => item.system_type == 'hardware'
          );
          newCostState.cost = bomData;
          const bomShowState = bomData.bom.map(() => true);
          const sbomShowState = bomData.sbom.map(() => true);
          setHideState({
            ...hideState,
            bom: bomShowState,
            sbom: sbomShowState,
          });
        }
        if (
          bomResponse.status === 'rejected' ||
          costResponse.status === 'rejected'
        ) {
          throw Error();
        }
        setCostState({ ...newCostState });
        setFilteredData({ ...newCostState });
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data.message || 'Internal server error');
        setCostState({ ...initState });
        dispatch(updateLoadingState(false));
      }
    };

    if (
      WizardState.selectedMachines.length > 0 &&
      WizardState.selectedToolKits.ai.length > 0
    ) {
      fetchTaskTypes(
        WizardState.selectedMachines,
        WizardState.selectedToolKits.ai
      );
    }
  }, [WizardState.selectedMachines]);

  const handleHideState = (
    identifier: 'bom' | 'sbom' | 'model',
    index: number
  ) => {
    const newState = { ...hideState };
    newState[identifier] = [...newState[identifier]];
    newState[identifier][index] = !newState[identifier][index];
    setHideState({ ...newState });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    const dataArray = [...(filteredData.cost?.bom || [])];

    function searchBOM(bom: BOM[]): BOM[] {
      return bom.filter(
        (item) =>
          regex.test(item.item_name) ||
          regex.test(item.pricing.description) ||
          regex.test(item.pricing.cloud_name) ||
          regex.test(item.pricing.monthly_cost.value.toString()) ||
          regex.test(item.pricing.yearly_cost.value.toString()) ||
          regex.test(item.pricing.daily_cost.value.toString())
      );
    }
    const newState = { ...filteredData };
    if (newState.cost) {
      newState.cost = { ...newState.cost };
      newState.cost.bom = [...searchBOM(dataArray)];
    }

    setCostState({ ...newState });
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
                    className="step s6"
                    id="projected-cost-screen"
                    style={{ display: 'block' }}
                  >
                    <div className="panel-heading">
                      <h4 className="panel-title">Projected Costs</h4>
                    </div>
                    <div
                      className="panel-body panel-collapse collapse in"
                      aria-expanded="true"
                    >
                      <div className="row cost-details">
                        <div className="col-sm-12">
                          <h4>Cost details</h4>
                        </div>
                      </div>
                      <div className="row form-group">
                        <div className="col-md-12">
                          <div
                            id="cost-table-list_wrapper"
                            className="dataTables_wrapper form-inline no-footer"
                          >
                            <div className="row">
                              <div className="col-xs-6">
                                <div
                                  className="dataTables_length"
                                  id="cost-table-list_length"
                                  style={{ display: 'none' }}
                                >
                                  <label>
                                    <select
                                      name="cost-table-list_length"
                                      aria-controls="cost-table-list"
                                      className="form-control input-sm"
                                    >
                                      <option value="10">10</option>
                                      <option value="25">25</option>
                                      <option value="50">50</option>
                                      <option value="100">100</option>
                                    </select>{' '}
                                    records per page
                                  </label>
                                </div>
                              </div>
                              <div className="col-xs-6">
                                <div
                                  id="cost-table-list_filter"
                                  className="dataTables_filter"
                                >
                                  <label>
                                    Search:
                                    <input
                                      onChange={handleSearch}
                                      type="search"
                                      className="form-control input-sm"
                                      placeholder="Filter"
                                      aria-controls="cost-table-list"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <table
                              id="cost-table-list"
                              className="table v-align table-striped table-hover filter-table dataTable no-footer"
                              role="grid"
                              aria-describedby="cost-table-list_info"
                            >
                              <thead>
                                <tr role="row">
                                  <th
                                    className="sorting_asc"
                                    tabIndex={0}
                                    aria-controls="cost-table-list"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label=" Model : activate to sort column descending"
                                    aria-sort="ascending"
                                    style={{ width: '0px' }}
                                  >
                                    Model
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="cost-table-list"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label=" Machine type : activate to sort column ascending"
                                    style={{ width: '0px' }}
                                  >
                                    Machine type
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="cost-table-list"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label=" Monthly cost : activate to sort column ascending"
                                    style={{ width: '0px' }}
                                  >
                                    Monthly cost
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="cost-table-list"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label=" Yearly cost : activate to sort column ascending"
                                    style={{ width: '0px' }}
                                  >
                                    Yearly cost
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {costState?.models?.map((item) => (
                                  <tr
                                    key={item?.inference_id}
                                    className="odd"
                                    data-model-id="201"
                                    role="row"
                                  >
                                    <td className="sorting_1">{item?.model}</td>
                                    <td> {item?.machine_type} </td>
                                    <td> $ {item?.monthly_cost}</td>
                                    <td> $ {item?.yearly_cost}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="row">
                              <div className="col-xs-6">
                                <div
                                  className="dataTables_info"
                                  id="cost-table-list_info"
                                  role="status"
                                  aria-live="polite"
                                  style={{ display: 'none' }}
                                >
                                  Showing 1 to 1 of 1 entries
                                </div>
                              </div>
                              <div className="col-xs-6">
                                <div
                                  className="dataTables_paginate paging_simple_numbers"
                                  id="cost-table-list_paginate"
                                  style={{ display: 'none' }}
                                >
                                  <ul className="pagination">
                                    <li
                                      className="paginate_button previous disabled"
                                      aria-controls="cost-table-list"
                                      tabIndex={0}
                                      id="cost-table-list_previous"
                                    >
                                      <a href="#">Previous</a>
                                    </li>
                                    <li
                                      className="paginate_button active"
                                      aria-controls="cost-table-list"
                                      tabIndex={0}
                                    >
                                      <a href="#">1</a>
                                    </li>
                                    <li
                                      className="paginate_button next disabled"
                                      aria-controls="cost-table-list"
                                      tabIndex={0}
                                      id="cost-table-list_next"
                                    >
                                      <a href="#">Next</a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div role="tabpanel">
                        {/* Nav tabs */}
                        <ul className="nav nav-tabs" role="tablist">
                          <li
                            role="presentation"
                            className="info-main-tab active"
                          >
                            <a
                              href="#info-tab"
                              aria-controls="info-tab"
                              id="llms-tab"
                              role="tab"
                              data-toggle="tab"
                            >
                              Bill of materials
                            </a>
                          </li>

                          <li role="presentation">
                            <a
                              href="#summary-tab"
                              aria-controls="summary-tab"
                              id="private-ai-tab"
                              role="tab"
                              data-toggle="tab"
                            >
                              Software Bill of materials
                            </a>
                          </li>
                        </ul>

                        <div className="tab-content">
                          <div
                            role="tabpanel"
                            className="tab-pane active"
                            id="info-tab"
                          >
                            <div className="wf-accordion-group js-accordion-group-bom">
                              {/* Accordion 1 */}
                              {costState?.cost?.bom?.map((item, index) => (
                                <div
                                  key={item?.item_id}
                                  className="wf-accordion js-accordion"
                                >
                                  <div className="wf-accordion__header js-accordion__header">
                                    <h3>
                                      <button
                                        type="button"
                                        className="wf-accordion__trigger js-accordion__trigger accordion-title"
                                        aria-expanded={false}
                                        aria-controls="accordion-2__panel-0"
                                        id="accordion-2__header-0"
                                        onClick={() =>
                                          handleHideState('bom', index)
                                        }
                                      >
                                        {item?.item_name}
                                      </button>
                                    </h3>
                                  </div>
                                  <div
                                    className="wf-accordion__panel js-accordion__panel"
                                    aria-hidden={hideState?.bom?.[index]}
                                    id="accordion-2__panel-0"
                                    aria-labelledby="accordion-2__header-0"
                                  >
                                    <div className="row form-group">
                                      <div className="col-md-12">
                                        <table className="table v-align table-striped">
                                          <thead>
                                            <tr>
                                              <th>Name</th>
                                              <th>Daily</th>
                                              <th>Monthly</th>
                                              <th>Yearly</th>
                                            </tr>
                                          </thead>
                                          <BomComp item={item} index={index} />
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div
                            role="tabpanel"
                            className="tab-pane"
                            id="summary-tab"
                          >
                            <div className="wf-accordion-group js-accordion-group-bom">
                              {/* Accordion 1 */}
                              {costState?.cost?.sbom?.map((item, index) => (
                                <div
                                  key={item?.item_id}
                                  className="wf-accordion js-accordion"
                                >
                                  <div className="wf-accordion__header js-accordion__header">
                                    <h3>
                                      <button
                                        type="button"
                                        className="wf-accordion__trigger js-accordion__trigger accordion-title"
                                        aria-expanded={false}
                                        onClick={() =>
                                          handleHideState('sbom', index)
                                        }
                                        aria-controls="accordion-3__panel-0"
                                        id="accordion-3__header-0"
                                      >
                                        {item?.item_name}
                                      </button>
                                    </h3>
                                  </div>

                                  <div
                                    className="wf-accordion__panel js-accordion__panel"
                                    aria-hidden={hideState?.sbom?.[index]}
                                    id="accordion-3__panel-0"
                                    aria-labelledby="accordion-3__header-0"
                                  >
                                    <div className="row form-group">
                                      <div className="col-md-12">
                                        <table className="table v-align table-striped">
                                          <thead>
                                            <tr>
                                              <th>Name</th>
                                              <th>Hourly</th>
                                              <th>Monthly</th>
                                              <th>Yearly</th>
                                            </tr>
                                          </thead>
                                          <BomComp item={item} index={index} />
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="pull-right">
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="prev"
                              data-prev-pageid="5"
                              onClick={() => navigate('/wizard/mission')}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="cost"
                              onClick={() => navigate('/wizard/topology')}
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

const BomComp: React.FC<BomProp> = ({ item }) => {
  return (
    <React.Fragment key={item?.item_id}>
      <tbody>
        <tr role="row">
          <td>{item?.item_name}</td>
          <td> {item?.pricing?.daily_cost?.value || 0}</td>
          <td> $ {item?.pricing?.monthly_cost?.value || 0}</td>
          <td> $ {item?.pricing?.yearly_cost?.value || 0}</td>
        </tr>
      </tbody>

      {item?.bom?.map((nbom, index) => (
        <BomComp key={nbom?.item_id} index={index} item={nbom} />
      ))}
    </React.Fragment>
  );
};

export default Costs;
