import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateAuth, updateFromLogin } from '../../redux/authSlice';
import axios, { AxiosError } from 'axios';
import { validateEmail, validatePassword } from '../../utils/validationHelper';
import { API } from '../../apiconfig';
import { ApiErrorResponse } from '../../types/wizardTypes';
import { jwtDecode } from 'jwt-decode';
import { AppDispatch } from '../../redux/store';

const Login: React.FC = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({
    success: true,
    emailError: '',
    passwordError: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = formState;

    const initialApiError = {
      success: true,
      emailError: '',
      passwordError: '',
    };

    if (!validateEmail(email)) {
      setApiError({ ...initialApiError, emailError: 'Enter valid email' });
    } else if (!validatePassword(password)) {
      setApiError({ ...initialApiError, emailError: 'Enter a valid password' });
    } else {
      try {
        // local
        // const response = await axios.get(API.LIVE_URL + "login");

        // live
        setLoading(true);
        const credentials = btoa(`${email}:${password}`);
        const response = await axios.post(
          API.API_AUTH + 'login',
          {},
          {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          }
        );
        // live
        const data = await response.data;
        const decodedData = jwtDecode(data.data.access_token);
        setApiError({
          success: true,
          emailError: '',
          passwordError: '',
        });

        localStorage.setItem('authObj', JSON.stringify(data.data));
        localStorage.setItem('userObj', JSON.stringify(decodedData));
        dispatch(updateAuth(data.data));
        dispatch(updateFromLogin(true));
        if (data?.data?.is_admin) {
          navigate('/dashboard');
        } else {
          navigate('/wizard/task_types');
        }
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        setApiError({
          ...initialApiError,
          success: false,
          passwordError:
            error.response?.data.message || 'incorrect username or password',
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="block-center mt-xl wd-xl login-screen">
      {/* <!-- START panel--> */}
      <div className="panel panel-dark panel-flat">
        <div className="text-center">
          <h2 className="login-title"> Rokket AI </h2>
        </div>
        <div className="panel-body">
          <p className="text-center pv mb0">LOG IN TO CONTINUE</p>

          <form
            role="form"
            action="applications-list.html"
            data-parsley-validate=""
            method="post"
            id="customer-login-form"
          >
            <div className="form-group has-feedback">
              <input
                id="exampleInputEmail1"
                type="email"
                placeholder="Enter email"
                required
                value={formState.email}
                data-parsley-error-message="Enter valid email"
                className="form-control"
                name="email"
                onChange={handleFormState}
              />
              <span className="fa fa-envelope form-control-feedback text-muted"></span>
              {apiError.emailError && (
                <p className="error-message text-danger">
                  {apiError.emailError}
                </p>
              )}
            </div>
            <div className="form-group has-feedback">
              <input
                id="exampleInputPassword1"
                type="password"
                name="password"
                value={formState.password}
                onChange={handleFormState}
                placeholder="Password"
                required
                className="form-control"
              />
              <span className="fa fa-lock form-control-feedback text-muted"></span>
              {apiError.passwordError && (
                <p className="error-message text-danger">
                  {apiError.passwordError}
                </p>
              )}
            </div>

            <div className="pull-right form-group">
              {' '}
              <Link to="/forgotpassword" className="primary-text crice">
                {' '}
                Forgot password?
              </Link>{' '}
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-primary form-control btn-spiner"
                id="login-btn"
                onClick={handleLogin}
              >
                {' '}
                {loading && <span className="loader"></span>}Log in{' '}
              </button>
            </div>
            <div className="text-center form-group">
              <p> Need to sign up? </p>
            </div>
            <Link to="/register" className="btn btn-default form-control">
              {' '}
              Sign up{' '}
            </Link>
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
  );
};

export default Login;
