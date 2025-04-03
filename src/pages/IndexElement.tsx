/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReduxState } from '../redux/store';

const IndexElement: React.FC = () => {
  const navigate = useNavigate();
  const AuthState = useSelector((state: ReduxState) => state.AuthSlice);
  useEffect(() => {
    if (AuthState.authObj?.is_admin) {
      navigate('/dashboard');
    } else {
      navigate('/wizard/task_types');
    }
  }, [AuthState.authObj]);

  return <></>;
};

export default IndexElement;
