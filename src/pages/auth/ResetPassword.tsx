import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validatePassword } from '../../utils/validationHelper';
import axios, { AxiosError } from 'axios';
import { API } from '../../apiconfig';
import { ApiErrorResponse } from '../../types/wizardTypes';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../redux/store';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const authState = useSelector((state: ReduxState) => state.AuthSlice);

  console.log('this is authState', authState.email);

  const [formState, setFormState] = useState({
    code: '',
    password: '',
    confirmPass: '',
  });
  const [apiError, setApiError] = useState({
    success: true,
    codeError: '',
    passError: '',
    confirmPassError: '',
  });

  const handleFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleClick = async () => {
    const initialErrorState = {
      success: true,
      codeError: '',
      passError: '',
      confirmPassError: '',
    };

    if (formState.code.length < 3 || formState.code.length > 6) {
      setApiError({
        ...initialErrorState,
        codeError: 'confirmation code must be between 3 and 6 characters',
      });
    } else if (!validatePassword(formState.password)) {
      setApiError({
        ...initialErrorState,
        passError: 'password policy does not match',
      });
    } else if (formState.password !== formState.confirmPass) {
      setApiError({
        ...initialErrorState,
        confirmPassError: 'both password should match',
      });
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API.API_AUTH + 'reset-password', {
          email: authState.email,
          confirmation_code: formState.code,
          new_password: formState.password,
        });
        const data = await response.data;
        console.log('this is data', data);
        setApiError({ ...initialErrorState });
        navigate('/login');
      } catch (err) {
        console.log('this is err', err);
        const error = err as AxiosError<ApiErrorResponse>;
        setApiError({
          ...initialErrorState,
          success: false,
          confirmPassError:
            error.response?.data.message || 'Invalid confirmation code',
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="block-center mt-xl wd-xxl">
        {/* <!-- START panel--> */}
        <div className="panel panel-dark panel-flat login-screen">
          <div className="text-center">
            <div className="text-center">
              {' '}
              <h2 className="login-title"> Rokket AI </h2>{' '}
            </div>
          </div>
          <div className="panel-body">
            <h4 className="pv mb0 login-h4">Reset Password</h4>
            <p>
              Make sure you include numbers and punctuation marks to create a
              strong password.
            </p>
            <form role="form" data-parsley-validate="" id="customer-login-form">
              <div className="form-group has-feedback">
                <input
                  id="code"
                  type="text"
                  placeholder="Confirmation Code"
                  required
                  name="code"
                  value={formState.code}
                  className="form-control"
                  onChange={handleFormState}
                />
                {/* <span className="fa fa-lock form-control-feedback text-muted"></span> */}
                {apiError.codeError && (
                  <p className="error-message text-danger">
                    {apiError.codeError}
                  </p>
                )}
              </div>
              <div className="form-group has-feedback">
                <input
                  id="password"
                  type="password"
                  placeholder="New Password"
                  required
                  value={formState.password}
                  name="password"
                  onChange={handleFormState}
                  data-parsley-error-message="Enter new password"
                  className="form-control"
                />
                {apiError.passError && (
                  <p className="error-message text-danger">
                    {apiError.passError}
                  </p>
                )}
              </div>
              <div className="form-group has-feedback">
                <input
                  id="exampleInputPassword2"
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={formState.confirmPass}
                  name="confirmPass"
                  onChange={handleFormState}
                  data-parsley-equalto="#password"
                  data-parsley-error-message="Password should be the same."
                  className="form-control"
                />
                {apiError.confirmPassError && (
                  <p className="error-message text-danger">
                    {apiError.confirmPassError}
                  </p>
                )}
              </div>
              <div className="clearfix">
                <div className="pull-right">
                  <button
                    type={'button'}
                    onClick={handleClick}
                    className="btn btn-primary"
                  >
                    {loading && <span className="loader"></span>}Reset Password
                  </button>
                </div>
                <div className="pull-right pt-sm">
                  {' '}
                  <Link to={'/login'} className="gray-text mrg-right font-16">
                    Cancel
                  </Link>{' '}
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* <!-- END panel--> */}
        <div className="p-lg text-center login-footer">
          {' '}
          <span>&copy;</span> <span>2024</span> <span>-</span>{' '}
          <span>Rokket AI</span> <br />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
