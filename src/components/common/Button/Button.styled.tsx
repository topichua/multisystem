import styled from 'styled-components';
import { Button as AntdButton } from 'antd';

export const RightIcon = styled.div`
  display: inline-flex;
  margin-inline-start: ${(props) => props.theme.spacing.tight};
`;

export const Button = styled(AntdButton)`
  display: flex;
  align-items: center;
  justify-content: center;

  &.ant-btn-link {
    padding-right: 0;
    padding-left: 0;
    color: #212121;
  }

  &.ant-btn-text ${RightIcon} {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.theme.colors.components.background.primaryBackground};
    border: ${(props) =>
      `1px solid ${props.theme.colors.components.border.primaryBorder}`};

    & svg {
      width: 12px;
      height: 12px;
    }
  }
`;
