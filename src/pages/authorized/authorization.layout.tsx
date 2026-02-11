import { ChevronUpDouble } from '@untitled-ui/icons-react';
import { Skeleton } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from 'react-scroll-up';
import { AuthStore } from 'src/store/auth.store';
import * as S from '../../styled/general.layout.styled';
import withAuthorization from './withAuthorization';

const AuthorizedLayoutInternal = observer(() => {
  const location = useLocation();
  const [init, setInit] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const store = React.useMemo(() => new AuthStore(), []);
  const navigate = useNavigate();

  React.useEffect(() => {
    setInit(true);

    const isAuthorized = localStorage.getItem('authorization');
    const isResetPasswordPath = location.pathname.includes('/reset-password');

    if (!isAuthorized) {
      if (isResetPasswordPath) {
        navigate('/account/sign-in', { replace: true });
      } else {
        navigate('/account/sign-in', {
          state: { from: location },
          replace: true,
        });
      }
    }
  }, [location.pathname, navigate]);

  if (store.isLoading || !init) {
    return (
      <>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </>
    );
  }

  return (
    <ResourcesStoreContext.Provider value={store}>
      <Outlet />
      <ScrollToTop
        showUnder={160}
        duration={1500}
        style={{
          right: 0,
        }}
      >
        <S.FloatButtonStyled
          type="primary"
          shape="circle"
          icon={<ChevronUpDouble />}
        />
      </ScrollToTop>
    </ResourcesStoreContext.Provider>
  );
});

export const AuthorizationLayout = withAuthorization(AuthorizedLayoutInternal);

export const ResourcesStoreContext = React.createContext<AuthStore>(
  {} as AuthStore
);

export const useCurrentUserStore = () =>
  React.useContext(ResourcesStoreContext);

export const EnsureProvider = observer((props: React.PropsWithChildren<{}>) => {
  const { isLoading } = useCurrentUserStore();
  if (isLoading) return null;
  return <>{props.children}</>;
});
