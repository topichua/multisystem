import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import { accountAPI } from 'src/transport/account/account.api';
import { storeUserCredentialsInLocalStorage } from 'src/utils/route-utils';

export const ImpersonatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const usernameParam = queryParams.get('username');
  const passwordParam = queryParams.get('password');
  const impersonatorIdParam = queryParams.get('impersonatorId') || '';

  useEffect(() => {
    localStorage.removeItem('authorization');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    if (usernameParam && passwordParam) {
      accountAPI
        .login(usernameParam, passwordParam, impersonatorIdParam)
        .then((resp) => {
          storeUserCredentialsInLocalStorage(resp);
          navigate('/');
        })
        .catch(() => {
          navigate('/account/sign-in');
        });
    }
  }, []);

  return <Spin spinning size="large" />;
};
