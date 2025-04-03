import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/validationHelper';
import { API } from '../../apiconfig';
import { useDispatch } from 'react-redux';
import { updateEmail } from '../../redux/authSlice';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({ email: '' });
  const [apiError, setApiError] = useState({
    success: true,
    emailError: '',
  });

  const handleFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const initialApiError = {
      success: true,
      emailError: '',
    };
    const { email } = formState;
    let valid = true;
    let emailError = '';

    if (!validateEmail(email)) {
      emailError = 'Enter a valid email';
      valid = false;
    }

    if (!valid) {
      setApiError({
        success: false,
        emailError,
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(API.API_AUTH + 'forgot-password', {
        email: formState.email,
      });
      // const response = await axios.get(API.LOCAL_URL + "forgot-password");
      const data = await response.data;
      setApiError({
        success: true,
        emailError: '',
      });
      console.log('forget password data', data);
      dispatch(updateEmail(formState.email));
      navigate('/resetpassword');
    } catch (error) {
      console.log('forget password error', error);
      setApiError({
        ...initialApiError,
        success: false,
      });
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="block-center mt-xl wd-xl login-screen">
        {/* <!-- START panel--> */}
        <div className="panel panel-dark panel-flat">
          <div className="text-center">
            <div className="text-center">
              <h2 className="login-title"> Rokket AI </h2>
            </div>
          </div>
          <div className="panel-body">
            <h4 className="pv mb0 login-h4">Recover Password</h4>
            <p className="pv">
              Enter the Email address on your account and we'll email you a link
              to reset password{' '}
            </p>
            <form role="form" data-parsley-validate="" id="customer-login-form">
              <div className="form-group has-feedback">
                <input
                  id="exampleInputEmail1"
                  type="email"
                  placeholder="Enter email"
                  required
                  name="email"
                  data-parsley-error-message="Enter valid email"
                  className="form-control"
                  value={formState.email}
                  onChange={handleFormState}
                />
                {apiError.emailError && (
                  <p className="error-message text-danger">
                    {apiError.emailError}
                  </p>
                )}
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary form-control btn-spiner"
                  onClick={handleForgetPassword}
                >
                  {loading && <span className="loader"></span>} Send recovery
                  link
                </button>
              </div>
              <div className="text-center form-group">
                <p className="font-16"> or </p>
              </div>

              <Link to={'/login'} className="btn btn-default form-control">
                Back
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
    </div>
  );
};

export default ForgotPassword;
