/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Sidebar from '.././Sidebar';
import { updateLoadingState } from '../../../redux/wizardSlice';
import { API } from '../../../apiconfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../../redux/store';
import TableLoader from '../../components/TableLoader';
import { Link } from 'react-router-dom';
import { updateLLMList } from '../../../redux/dashboardSlice';
import { TestInfo } from '../../../types/TestTypes';

const TestComp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const WizarsState = useSelector((state: ReduxState) => state.WizardSlice);
  const [testData, setTestData] = useState<TestInfo[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'admin/test', {
          headers: { Authorization: `Bearer ${authObj.access_token}` },
        });
        // const response = await axios.get(API.LOCAL_URL + "tests");
        const data = response?.data?.data;
        setTestData(data);
        dispatch(updateLoadingState(false));
      } catch (error) {
        setTestData([]);
        dispatch(updateLoadingState(false));
      }
    };
    fetchModels();
  }, []);

  if (WizarsState.loading) {
    return <TableLoader />;
  } else
    return (
      <div className="wrapper dashboard-main">
        <header className="topnavbar-wrapper">
          <nav role="navigation" className="navbar topnavbar">
            <div className="user-section">
              <h2 className="logo-title">Rokket AI</h2>
            </div>
            <div className="sec-title">
              <h3 className="sec_title_tag" data-picklistid="">
                Test Module List
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
                  <h4 className="panel-title">
                    TEST LIST
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
                                Test Name
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
                                Test Metrics
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {testData.map((test, index) => (
                              <tr
                                key={index}
                                role="row"
                                data-id={test.test_id}
                                className={index % 2 === 0 ? 'even' : 'odd'}
                              >
                                <td width="20%" className="sorting_1">
                                  <Link
                                    onClick={() => {
                                      dispatch(updateLLMList(test));
                                    }}
                                    to={`/testcompcreate/${test.test_id}`}
                                  >
                                    {test.test_name}
                                  </Link>
                                </td>
                                <td>
                                  {test.description ||
                                    'No description available'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
};

export default TestComp;
