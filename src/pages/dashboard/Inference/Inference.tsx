/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Sidebar from '.././Sidebar';
import { updateLoadingState } from '../../../redux/wizardSlice';
// import { API } from '../../../apiconfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/store';
import TableLoader from '../../components/TableLoader';
import { Link } from 'react-router-dom';
import { InferenceLLM } from '../../../types/Inference';
import { updateSelectedLLMList } from '../../../redux/dashboardSlice';

const Inference: React.FC = () => {
  const dispatch = useDispatch();
  const WizarsState = useSelector((state: ReduxState) => state.WizardSlice);
  const [inferenceData, setInferenceData] = useState<InferenceLLM[]>([]);

  useEffect(() => {
    const fetchInferences = async () => {
      try {
        dispatch(updateLoadingState(true));
        // const response = await axios.get(API.API_CB + 'inferences');
        // const data: InferenceLLM[] = await response.data.data;
        const response = await axios.get(`http://localhost:8000/inferences_in`);
        const data = response.data;

        // Map the response to the InferenceLLM type
        const mappedData = data.map(
          (inference: {
            id: string;
            llm_id: string;
            is_base: boolean;
            inference_name: string;
            inference_description: string;
            inference_parameters: { parameter_name: string }[];
            inference_tests: { test_id: string }[];
          }) => ({
            id: inference.id,
            llm_id: inference.llm_id,
            llm_base: inference.is_base,
            llm_name: inference.inference_name,
            inference_description: inference.inference_description,
            parameters: inference.inference_parameters
              .map((param: { parameter_name: string }) => param.parameter_name)
              .join(', '),
            tests: inference.inference_tests
              .map((test: { test_id: string }) => test.test_id)
              .join(', '),
          })
        );

        setInferenceData(mappedData);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setInferenceData([]);
        dispatch(updateLoadingState(false));
      }
    };
    fetchInferences();
  }, []);

  if (WizarsState.loading) {
    return <TableLoader />;
  } else
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
                Inference List{' '}
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
                  <h4 className="panel-title">
                    Inference List
                    <div className="pull-right">
                      {/* <button type="button" class="mt-m-20 btn btn-info btn-xs btn-tcenter" id="save-btns">Save</button> */}
                    </div>
                  </h4>
                </div>
                <div
                  className="panel-body panel-collapse collapse in"
                  aria-expanded="true"
                >
                  <div className="row form-group">
                    <div className="col-sm-12">
                      <div
                        id="list-table_wrapper"
                        className="dataTables_wrapper form-inline no-footer"
                      >
                        <div className="row">
                          <div className="col-xs-6">
                            <div
                              className="dataTables_length"
                              id="list-table_length"
                              style={{ display: 'none' }}
                            >
                              <label>
                                <select
                                  name="list-table_length"
                                  aria-controls="list-table"
                                  className="form-control input-sm"
                                >
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>{' '}
                                records per page
                              </label>
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div
                              id="list-table_filter"
                              className="dataTables_filter"
                            >
                              <label>
                                Search:
                                <input
                                  type="search"
                                  className="form-control input-sm"
                                  placeholder="Filter"
                                  aria-controls="list-table"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <table
                          id="list-table"
                          className="table table-striped table-hover dataTable no-footer"
                          role="grid"
                          aria-describedby="list-table_info"
                        >
                          <thead>
                            <tr role="row">
                              <th
                                className="sorting_asc"
                                tabIndex={0}
                                aria-controls="list-table"
                                rowSpan={1}
                                colSpan={1}
                                aria-label=" Model Name : activate to sort column descending"
                                aria-sort="ascending"
                                style={{ width: '361.775px' }}
                              >
                                {' '}
                                Inference Name{' '}
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="list-table"
                                rowSpan={1}
                                colSpan={1}
                                aria-label=" Description : activate to sort column ascending"
                                style={{ width: '330.625px' }}
                              >
                                {' '}
                                Base{' '}
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="list-table"
                                rowSpan={1}
                                colSpan={1}
                                aria-label=" Description : activate to sort column ascending"
                                style={{ width: '330.625px' }}
                              >
                                {' '}
                                Parameters{' '}
                              </th>
                              <th
                                className="sorting"
                                tabIndex={0}
                                aria-controls="list-table"
                                rowSpan={1}
                                colSpan={1}
                                aria-label=" Description : activate to sort column ascending"
                                style={{ width: '330.625px' }}
                              >
                                {' '}
                                Test{' '}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {inferenceData.map((model, index) => (
                              <tr
                                key={index}
                                role="row"
                                data-id={model.llm_id}
                                className={index % 2 === 0 ? 'even' : 'odd'}
                              >
                                <td width="20%" className="sorting_1">
                                  <Link
                                    onClick={() => {
                                      dispatch(updateSelectedLLMList(model));
                                    }}
                                    to={`/inferencecreate/${model.id}`}
                                  >
                                    {model.llm_name}
                                  </Link>
                                </td>
                                <td>{model.llm_base ? 'Yes' : 'No'}</td>
                                <td>
                                  {/* {`${model.latency ? 'Latency ' : ''}` +
                                    `${model.throughput ? 'Throughput ' : ''}`} */}
                                  {model.parameters}
                                </td>
                                <td>{model.tests}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row">
                          <div className="col-xs-6">
                            <div
                              className="dataTables_info"
                              id="list-table_info"
                              role="status"
                              aria-live="polite"
                              style={{ display: 'none' }}
                            >
                              Showing 1 to 3 of 3 entries
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div
                              className="dataTables_paginate paging_simple_numbers"
                              id="list-table_paginate"
                              style={{ display: 'none' }}
                            >
                              <ul className="pagination">
                                <li
                                  className="paginate_button previous disabled"
                                  aria-controls="list-table"
                                  tabIndex={0}
                                  id="list-table_previous"
                                >
                                  <a href="#">Previous</a>
                                </li>
                                <li
                                  className="paginate_button active"
                                  aria-controls="list-table"
                                  tabIndex={0}
                                >
                                  <a href="#">1</a>
                                </li>
                                <li
                                  className="paginate_button next disabled"
                                  aria-controls="list-table"
                                  tabIndex={0}
                                  id="list-table_next"
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

export default Inference;
