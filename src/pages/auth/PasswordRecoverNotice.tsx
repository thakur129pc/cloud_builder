import React from 'react';

const PasswordRecoverNotice: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="block-center mt-xl wd-xxl login-screen">
        {/* <!-- START panel--> */}
        <div className="panel panel-dark panel-flat">
          <div className="text-center">
            {' '}
            <div className="text-center">
              {' '}
              <h2 className="login-title"> Rokket AI </h2>{' '}
            </div>{' '}
          </div>
          <div className="panel-body">
            <h4 className="pv mb0 login-h4">Recover Password</h4>
            <p className="text-center pv">
              Email with link to reset password is sent to john.smith@gmail.com.
              Please check you email reset your Rokket AI password.{' '}
            </p>
            <p className="text-center mb0">
              {' '}
              <a href="#"> Not john.smith@gmail.com? </a>{' '}
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

export default PasswordRecoverNotice;
