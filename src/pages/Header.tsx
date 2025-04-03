const Header: React.FC = () => {
  return (
    <header className="topnavbar-wrapper">
      {/* <!-- START Top Navbar--> */}
      <nav role="navigation" className="navbar topnavbar">
        {/* <!-- START navbar header--> */}
        <div className="user-section">
          <h2 className="logo-title"> Rokket AI </h2>
        </div>
        <div className="sec-title">
          <h3 className="sec_title_tag" data-picklistid>
            {' '}
            &nbsp;{' '}
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
                <em className="fa fa-navicon"></em>{' '}
              </a>
            </li>
            {/* <!-- START User avatar toggle--> */}
          </ul>
        </div>
        {/* <!-- END Nav wrapper--> */}
      </nav>
      {/* <!-- END Top Navbar--> */}
    </header>
  );
};
export default Header;
