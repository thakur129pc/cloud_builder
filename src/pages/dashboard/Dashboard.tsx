import React from 'react';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
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
              Infrastructure dashboard{' '}
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
                  Dashboard
                  <div className="pull-right">
                    {/* <button type="button" class="mt-m-20 btn btn-info btn-xs btn-tcenter" id="save-btns">Save</button> */}
                  </div>
                </h4>
              </div>
              <div
                className="panel-body panel-collapse collapse in"
                aria-expanded="true"
              >
                <div className="row">
                  <div className="col-lg-9">
                    {/* START chart*/}
                    <div className="row">
                      <div className="col-lg-12">
                        {/* START widget*/}
                        <div id="panelChart9" className="">
                          <img src="../../../public/download.png" />
                        </div>
                        {/* END widget*/}
                      </div>
                    </div>
                  </div>
                  {/* CHART_END */}
                  <div className="col-md-3"></div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <h4 className="panel-title">Compliance documents</h4>
                        </div>
                        <div className="panel-body product_table_sec">
                          <div
                            id="Best-selling_wrapper"
                            className="dataTables_wrapper form-inline no-footer"
                          >
                            <div className="row">
                              <div className="col-xs-6" />
                              <div className="col-xs-6">
                                <div
                                  id="Best-selling_filter"
                                  className="dataTables_filter"
                                >
                                  <label>
                                    Search:
                                    <input
                                      type="search"
                                      className="form-control input-sm"
                                      placeholder=""
                                      aria-controls="Best-selling"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <table
                              id="Best-selling"
                              className="table table-striped table-hover dataTable no-footer"
                              role="grid"
                            >
                              <thead>
                                <tr role="row">
                                  <th
                                    className="sorting_asc width-das-1"
                                    tabIndex={0}
                                    aria-controls="Best-selling"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-sort="ascending"
                                    aria-label="Document Name: activate to sort column descending"
                                  >
                                    Document Name
                                  </th>
                                  <th
                                    className="sorting width-das"
                                    tabIndex={0}
                                    aria-controls="Best-selling"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Action: activate to sort column ascending"
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">
                                    PCI DSS Compliance Checklist
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                      style={{ color: '#CB427C' }}
                                    />
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">
                                    PCI DSS Incident Response Plan
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                      style={{ color: '#CB427C' }}
                                    />
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">
                                    PCI DSS Risk Assessment Report
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                      style={{ color: '#CB427C' }}
                                    />
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">
                                    PCI DSS Security Incident Response Plan
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                      style={{ color: '#CB427C' }}
                                    />
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">
                                    PCI DSS Training Materials
                                  </td>
                                  <td>
                                    <i
                                      className="fa fa-download"
                                      aria-hidden="true"
                                      style={{ color: '#CB427C' }}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="row">
                              <div className="col-xs-6" />
                              <div className="col-xs-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* CIRCLE_CHART_END */}
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

export default Dashboard;
