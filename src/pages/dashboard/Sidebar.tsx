import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type ActiveMenu =
  | 'basemodel'
  | 'inferencemethod'
  | 'inference'
  | 'testmachine'
  | 'basemodelcreate'
  | 'inferencemethodcreate'
  | 'inferencecreate'
  | 'testmachinecreate'
  | 'certificationcreate'
  | 'certification'
  | 'taskgroupcreate'
  | 'taskgroup'
  | 'taskcreate'
  | 'testtypecreate'
  | 'testtype'
  | 'task'
  | 'testcompcreate'
  | 'testcomp'
  | 'appscreate'
  | 'apps'
  | 'aicreate'
  | 'ai'
  | 'itemscreate'
  | 'items'
  | 'bomcreate'
  | 'bom'
  | 'datasetcreate'
  | 'dataset'
  | 'tasktypecreate'
  | 'tasktype'
  | 'toolkitcreate'
  | 'toolkit'
  | 'dashboard';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard');

  useEffect(() => {
    const path = location.pathname.slice(1);
    const basePath = path.split('/')[0];
    const routes = [
      'dashboard',
      'basemodel',
      'basemodelcreate',
      'inferencemethod',
      'inferencemethodcreate',
      'inference',
      'inferencecreate',
      'testmachine',
      'testmachinecreate',
      'certification',
      'certificationcreate',
      'taskgroupcreate',
      'taskgroup',
      'taskcreate',
      'testtypecreate',
      'testtype',
      'task',
      'testcompcreate',
      'testcomp',
      'appscreate',
      'apps',
      'aicreate',
      'ai',
      'itemscreate',
      'items',
      'bomcreate',
      'bom',
      'datasetcreate',
      'dataset',
      'tasktypecreate',
      'tasktype',
      'toolkitcreate',
      'toolkit',
    ];
    if (routes.includes(basePath as ActiveMenu)) {
      setActiveMenu(basePath as ActiveMenu);
    } else {
      setActiveMenu('dashboard'); // Default to customer-list for home or unrecognized routes
    }
  }, [location]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('authObj');
    localStorage.removeItem('userObj');

    navigate('/login');
  };

  return (
    <aside className="aside">
      {/* START Sidebar (left)*/}
      <div className="aside-inner">
        <nav data-sidebar-anyclick-close="" className="sidebar">
          {/* START sidebar nav*/}
          <ul className="nav">
            {/* <li className=" first-nav">
                <a href="#" data-toggle-state="aside-collapsed" className="">
                  {" "}
                  <em className="fa fa-navicon" />{" "}
                </a>
              </li> */}
            <li className="infrastructure_menu">
              <a
                href="#infrastructure"
                className=""
                data-toggle="collapse"
                aria-expanded="true"
              >
                {' '}
                Infrastructure{' '}
              </a>
              <ul
                id="infrastructure"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('dashboard') ? 'in' : ''
                }`}
                aria-expanded={!location.pathname.includes('dashboard')}
                style={{}}
              >
                <li className="">
                  {' '}
                  <Link to="/wizard/task_types" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Wizard</span>
                  </Link>{' '}
                </li>
                <li className={activeMenu == 'dashboard' ? 'active' : ''}>
                  {' '}
                  <Link to="/dashboard" className="">
                    {' '}
                    <em /> <span data-localize=""> Dashboard </span>{' '}
                  </Link>{' '}
                </li>
                <li className="">
                  {' '}
                  <a href="#" className="">
                    {' '}
                    <em /> <span data-localize="">
                      {' '}
                      Manage Infrastructure{' '}
                    </span>{' '}
                  </a>{' '}
                </li>
                <li className="">
                  {' '}
                  <a href="#" className="">
                    {' '}
                    <em /> <span data-localize=""> Reconfigure</span>{' '}
                  </a>
                </li>
                <li className="machine-types-link">
                  {' '}
                  <a href="#" className="">
                    {' '}
                    <em /> <span data-localize=""> Machine types</span>{' '}
                  </a>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#dataset-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Dataset{' '}
              </a>
              <ul
                id="dataset-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('dataset') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('dataset')}
              >
                <li className={activeMenu == 'dataset' ? 'active' : ''}>
                  <Link to="/dataset" className={`wizard-menu-link`}>
                    {/* <Link to="#" className={`wizard-menu-link`}> */} <em />{' '}
                    <span data-localize=""> Dataset List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'datasetcreate' ? 'active' : ''}>
                  <Link to="/datasetcreate" className="wizard-menu-link">
                    {/* <Link to="#" className={`wizard-menu-link`}> */} <em />{' '}
                    <span data-localize=""> Dataset Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#Test-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Test{' '}
              </a>
              <ul
                id="Test-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('testcomp') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('test')}
              >
                <li className={activeMenu == 'testcomp' ? 'active' : ''}>
                  <Link to="/testcomp" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Test List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'testcompcreate' ? 'active' : ''}>
                  <Link to="/testcompcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Test Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#Test-type-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Test Type{' '}
              </a>
              <ul
                id="Test-type-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('testtype') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('testtype')}
              >
                <li className={activeMenu == 'testtype' ? 'active' : ''}>
                  <Link to="/testtype" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Test Type List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'testtypecreate' ? 'active' : ''}>
                  <Link to="/testtypecreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Test Type Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#Task-type-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Task Type{' '}
              </a>
              <ul
                id="Task-type-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('tasktype') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('tasktype')}
              >
                <li className={activeMenu == 'tasktype' ? 'active' : ''}>
                  <Link to="/tasktype" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Task Type List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'tasktypecreate' ? 'active' : ''}>
                  <Link to="/tasktypecreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Task Type Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#Test-group-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Test Group{' '}
              </a>
              <ul
                id="Test-group-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('task') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('testgroup')}
              >
                <li className={activeMenu == 'taskgroup' ? 'active' : ''}>
                  <Link to="/taskgroup" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Task Group List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'taskgroupcreate' ? 'active' : ''}>
                  <Link to="/taskgroupcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Task Group Create</span>
                  </Link>
                </li>
                <li className={activeMenu == 'task' ? 'active' : ''}>
                  <Link to="/task" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Task List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'taskcreate' ? 'active' : ''}>
                  <Link to="/taskcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Task Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#toolkit-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Admin Toolkit{' '}
              </a>
              <ul
                id="toolkit-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('toolkit') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('toolkit')}
              >
                <li className={activeMenu == 'toolkit' ? 'active' : ''}>
                  <Link to="/toolkit" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Toolkit List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'toolkitcreate' ? 'active' : ''}>
                  <Link to="/toolkitcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Toolkit Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#Test-Machine-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Test Machine{' '}
              </a>
              <ul
                id="Test-Machine-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('testmachine') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('testmachine')}
              >
                <li className={activeMenu == 'testmachine' ? 'active' : ''}>
                  <Link to="/testmachine" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Test Machine List</span>
                  </Link>
                </li>
                <li
                  className={activeMenu == 'testmachinecreate' ? 'active' : ''}
                >
                  <Link to="/testmachinecreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Test Machine Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#Base-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Base Model{' '}
              </a>
              <ul
                id="Base-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('basemodel') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('basemodel')}
              >
                <li className={activeMenu == 'basemodel' ? 'active' : ''}>
                  <Link to="/basemodel" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Base Model List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'basemodelcreate' ? 'active' : ''}>
                  <Link to="/basemodelcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Base Model Create</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="Base-model-menu">
              <a
                href="#Inference-method"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Inference Method{' '}
              </a>
              <ul
                id="Inference-method"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('inferencemethod') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('inferencemethod')}
              >
                <li className={activeMenu == 'inferencemethod' ? 'active' : ''}>
                  <Link to="/inferencemethod" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Inference Method List</span>
                  </Link>
                </li>
                <li
                  className={
                    activeMenu == 'inferencemethodcreate' ? 'active' : ''
                  }
                >
                  <Link
                    to="/inferencemethodcreate"
                    className="wizard-menu-link"
                  >
                    {' '}
                    <em /> <span data-localize="">Inference Method Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#Inference-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Inference{' '}
              </a>
              <ul
                id="Inference-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('inference') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('inference')}
              >
                <li className={activeMenu == 'inference' ? 'active' : ''}>
                  <Link to="/inference" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Inference List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'inferencecreate' ? 'active' : ''}>
                  <Link to="/inferencecreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Inference Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#Certification-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Certification{' '}
              </a>
              <ul
                id="Certification-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('certification') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('certification')}
              >
                <li className={activeMenu == 'certification' ? 'active' : ''}>
                  <Link to="/certification" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Certification List</span>
                  </Link>
                </li>
                <li
                  className={
                    activeMenu == 'certificationcreate' ? 'active' : ''
                  }
                >
                  <Link to="/certificationcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Certification Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#Apps-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Apps{' '}
              </a>
              <ul
                id="Apps-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('apps') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('apps')}
              >
                <li className={activeMenu == 'apps' ? 'active' : ''}>
                  <Link to="/apps" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> App List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'appscreate' ? 'active' : ''}>
                  <Link to="/appscreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> App Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#ai-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Private AI{' '}
              </a>
              <ul
                id="ai-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('apps') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('ai')}
              >
                <li className={activeMenu == 'ai' ? 'active' : ''}>
                  <Link to="/ai" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Infra List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'aicreate' ? 'active' : ''}>
                  <Link to="/aicreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Infra Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#items-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                Items{' '}
              </a>
              <ul
                id="items-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('items') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('items')}
              >
                <li className={activeMenu == 'items' ? 'active' : ''}>
                  <Link to="/items" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> Items List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'itemscreate' ? 'active' : ''}>
                  <Link to="/itemscreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> Items Create</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="Base-model-menu">
              <a
                href="#bom-model"
                className=""
                data-toggle="collapse"
                aria-expanded="false"
              >
                {' '}
                BOM{' '}
              </a>
              <ul
                id="bom-model"
                className={`nav sidebar-subnav collapse ${
                  location.pathname.includes('bom') ? 'in' : ''
                }`}
                aria-expanded={location.pathname.includes('bom')}
              >
                <li className={activeMenu == 'bom' ? 'active' : ''}>
                  <Link to="/bom" className={`wizard-menu-link`}>
                    {' '}
                    <em /> <span data-localize=""> BOM List</span>
                  </Link>
                </li>
                <li className={activeMenu == 'bomcreate' ? 'active' : ''}>
                  <Link to="/bomcreate" className="wizard-menu-link">
                    {' '}
                    <em /> <span data-localize=""> BOM Create</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="align-logout">
            <li className="">
              <a
                href="javascript:void(0)"
                id="logout-link"
                title="Logout"
                onClick={handleLogout}
              >
                {' '}
                <em className="icon-power" />{' '}
                <span data-localize="#">Logout</span>
              </a>
            </li>
          </ul>
          {/* END sidebar nav*/}
        </nav>
      </div>
      {/* END Sidebar (left)*/}
    </aside>
  );
};

export default Sidebar;
