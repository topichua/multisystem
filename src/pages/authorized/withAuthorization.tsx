import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withAuthorization(WrappedComponent: any) {
  const WithAuthorization: React.FC = (props) => {
    const navigate = useNavigate();
    const [init, setInit] = React.useState(false);

    useEffect(() => {
      setInit(true);
      if (!localStorage.getItem('authorization')) {
        // navigate(`/account/sign-in?returnUrl=${location.pathname}`);
      }
    }, [navigate]);

    if (!init) return null;

    return <WrappedComponent {...props} />;
  };

  return WithAuthorization;
}

export default withAuthorization;
