import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validationHelper';
import { API } from '../../apiconfig';
import { ApiErrorResponse } from '../../types/wizardTypes';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    code: '',
    isRegistered: false,
  });
  const [apiError, setApiError] = useState({
    success: true,
    emailError: '',
    passwordError: '',
    codeError: '',
  });

  const handleFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleRegister = async () => {
    const { email, password } = formState;

    const initialApiError = {
      success: true,
      emailError: '',
      passwordError: '',
      codeError: '',
    };

    if (!validateEmail(email)) {
      setApiError({
        ...initialApiError,
        emailError: 'Enter a valid email',
      });
    } else if (!validatePassword(password)) {
      setApiError({
        ...initialApiError,
        passwordError: 'Enter valid password',
      });
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API.API_AUTH + 'register', {
          work_email: formState.email,
          password: formState.password,
        });
        // const response = await axios.get(API.LOCAL_URL + "register");
        const data = await response.data;
        console.log('this is register response data', data);
        setFormState({ ...formState, isRegistered: true });
        setApiError({
          ...initialApiError,
        });
      } catch (err) {
        const error = err as AxiosError;
        setApiError({
          ...initialApiError,
          success: false,
          passwordError: error.message,
        });
        setLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    const initialErrorState = {
      success: true,
      codeError: '',
      passwordError: '',
      emailError: '',
    };

    if (formState.code.length < 3 || formState.code.length > 6) {
      setApiError({
        ...initialErrorState,
        codeError: 'confirmation code must be between 3 and 6 characters',
      });
    } else {
      try {
        const response = await axios.post(API.API_AUTH + 'confirm', {
          work_email: formState.email,
          code: formState.code,
        });
        const data = await response.data;
        setApiError({
          ...initialErrorState,
        });
        navigate('/login');
        console.log('this is register response data', data);
      } catch (err) {
        console.log('this is error in confirm', err);
        const error = err as AxiosError<ApiErrorResponse>;
        setApiError({
          ...initialErrorState,
          success: false,
          codeError:
            error.response?.data.message || 'Invalid confirmation code',
        });
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="block-center mt-xl wd-xl login-screen">
        {/* <!-- START panel--> */}
        <div className="panel panel-dark panel-flat">
          <div className="text-center">
            <h2 className="login-title">Rokket AI</h2>
          </div>
          <div className="panel-body">
            <p className="text-center pv mb0">SIGN UP</p>
            <form
              role="form"
              data-parsley-validate="true"
              className="mb-lg"
              action="#"
              method="post"
              id="customer-login-form"
            >
              {!formState.isRegistered ? (
                <>
                  <div className="form-group has-feedback">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      parsley-data-type=""
                      data-parsley-error-message="Enter valid email"
                      required
                      className="form-control"
                      name="email"
                      value={formState.email}
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
                      placeholder="Password"
                      data-parsley-error-message="Enter password"
                      required
                      className="form-control"
                      name="password"
                      value={formState.password}
                      onChange={handleFormState}
                    />
                    <span className="fa fa-lock form-control-feedback text-muted"></span>
                    {apiError.passwordError && (
                      <p className="error-message text-danger">
                        {apiError.passwordError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="form-group has-feedback">
                  <input
                    id="otp"
                    type="text"
                    placeholder="confirmation code"
                    required
                    className="form-control"
                    name="code"
                    value={formState.code}
                    onChange={handleFormState}
                  />
                  <span className="fa fa-lock form-control-feedback text-muted"></span>
                  {apiError.codeError && (
                    <p className="error-message text-danger">
                      {apiError.codeError}
                    </p>
                  )}
                </div>
              )}

              {!formState.isRegistered ? (
                <>
                  <div className="form-group">
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="btn btn-primary form-control btn-spiner"
                    >
                      {loading && <span className="loader"></span>}Sign up
                    </button>
                  </div>

                  <div className="text-center form-group">
                    <p>Already have an account?</p>
                  </div>

                  <div className="form-group">
                    <Link
                      to={'/login'}
                      className="btn btn-default form-control"
                    >
                      {' '}
                      Login{' '}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <button
                    type={'button'}
                    onClick={handleConfirm}
                    className="btn btn-primary form-control"
                  >
                    {' '}
                    Confirm
                  </button>
                </div>
              )}
            </form>
            <p>
              {' '}
              By signing up you agree to our{' '}
              <a href="#"> terms and conditions </a>{' '}
            </p>
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

export default Register;
