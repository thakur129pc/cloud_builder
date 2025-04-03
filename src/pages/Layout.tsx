/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSelectedOptions } from '../redux/wizardSlice';
import { AppDispatch, ReduxState } from '../redux/store';

const Layout: React.FC = () => {
  const location = useLocation();
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);
  useEffect(() => {
    const path = location.pathname;
    const body = document.body;

    // Remove any previously set classes
    body.classList.remove(
      'login',
      'forgotpassword',
      'register',
      'resetpassword',
      'passwordrecovernotice'
    );

    // Add new class based on the path
    if (path.includes('login')) {
      body.classList.add('login');
    } else if (path.includes('forgotpassword')) {
      body.classList.add('forgotpassword');
    } else if (path.includes('register')) {
      body.classList.add('register');
    } else if (path.includes('resetpassword')) {
      body.classList.add('resetpassword');
    } else if (path.includes('passwordrecovernotice')) {
      body.classList.add('passwordrecovernotice');
    }

    // Cleanup function to remove class when component unmounts or path changes
    return () => {
      body.classList.remove(
        'login',
        'forgotpassword',
        'register',
        'resetpassword',
        'passwordrecovernotice'
      );
    };
  }, [location.pathname]);
  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    '/login',
    '/register',
    '/forgotpassword',
    '/resetpassword',
    '/passwordrecovernotice',
    '/dashboard/dash',
  ];

  // Check if the current route should hide header and footer
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );

  const authObj =
    JSON.parse(localStorage.getItem('authObj') || 'false') || false;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // location.pathname != "/wizard/costs" &&
    // WizardState.selectedOptions.length > 0
    if (
      authObj.access_token &&
      !WizardState.compareModels &&
      location.pathname.includes('wizard')
    ) {
      dispatch(fetchUserSelectedOptions(authObj.access_token));
    }
    //  else if (
    //   location.pathname == "/wizard/costs" &&
    //   WizardState.selectedOptions.length == 0
    // ) {
    //   dispatch(fetchUserSelectedOptions(authObj.access_token));
    // }
  }, [location]);

  return (
    <div className="wrapper">
      {!shouldHideHeaderFooter && <Header />}
      <main>
        {' '}
        <Outlet />
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;
