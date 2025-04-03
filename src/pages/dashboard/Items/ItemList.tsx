/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { updateLoadingState } from '../../../redux/wizardSlice';
import { API } from '../../../apiconfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../../redux/store';
import TableLoader from '../../components/TableLoader';
import { Link } from 'react-router-dom';
import { updateSelectedTestMachine } from '../../../redux/dashboardSlice';
import { ItemDetails } from '../../../types/ItemsTypes';

const ItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authObj = JSON.parse(localStorage.getItem('authObj') || '{}');
  const WizarsState = useSelector((state: ReduxState) => state.WizardSlice);
  const [itemsList, setItemsList] = useState<ItemDetails[]>([]);

  useEffect(() => {
    const fetchItemsList = async () => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.get(API.API_CB + 'admin/mstr-item', {
          headers: {
            Authorization: `Bearer ${authObj?.access_token}`,
          },
        });
        // const response = await axios.get(API.LOCAL_URL + "models");
        const data = await response.data?.data;
        setItemsList(data);
      } catch (error) {
        setItemsList([]);
      } finally {
        dispatch(updateLoadingState(false));
      }
    };
    fetchItemsList();
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
                Items
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
                    ITEMS LIST
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
                                Part ID
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
                                Part Name
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
                                Part Type
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
                                Category
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
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsList?.map((item, index) => (
                              <tr
                                key={index}
                                role="row"
                                className={index % 2 === 0 ? 'even' : 'odd'}
                              >
                                <td width="20%" className="sorting_1">
                                  <Link
                                    onClick={() => {
                                      dispatch(updateSelectedTestMachine(item));
                                    }}
                                    to={`/itemscreate/${item?.item_id}`}
                                  >
                                    {item.item_id}
                                  </Link>
                                </td>
                                <td>
                                  {item.item_name ||
                                    'Description not available'}
                                </td>
                                <td>{item.part_type || ''}</td>
                                <td>{item.category || ''}</td>
                                <td>{item.description}</td>
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
      </div>
    );
};

export default ItemList;
