import { Form as AntdForm } from 'antd';
import styled from 'styled-components';

export const Form = styled(AntdForm)`
  .ant-form-item-label {
    padding: 0;

    label {
      height: 30px;
    }
  }
`;

export const IconWrapper = styled.div`
  border: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  padding: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  display: flex;
  justify-content: center;
  align-content: center;
  box-shadow: 0px 0px 0px 5px #f9fafb;
`;

export const AccountLayoutStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: center;

  .content {
    width: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  .img {
    width: 55%;
    font-size: 0;

    img {
      width: 100%;
      height: 100vh;
      object-fit: cover;
    }
  }
`;
