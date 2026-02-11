import Back from 'src/assets/login-bg.jpg';
import { Grid } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import * as S from './account.styled';
import { useEffect } from 'react';

const { useBreakpoint } = Grid;

export const AccountLayout = () => {
  const size = useBreakpoint();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.set("authorization", "test");
    if (localStorage.getItem('authorization')) {
      navigate('/');
    }
  }, []);

  return (
    <S.AccountLayoutStyled>
      <div
        className="content"
        style={{ width: size.md ? '45%' : '100%', padding: '40px 0px' }}
      >
        <main>
          <Outlet />
        </main>
      </div>
      {size.md && (
        <div className="img">
          <img src={Back} alt="OTA Connect" />
        </div>
      )}
    </S.AccountLayoutStyled>
  );
};
