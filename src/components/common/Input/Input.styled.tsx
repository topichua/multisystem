import styled from 'styled-components';
import { Input as AntdInput } from 'antd';

const baseInputStyles = `
  .ant-input-prefix {
    color: #98a2b3;
    margin-inline-end: 8px;
  }
`;

export const Input = styled(AntdInput)`
  ${baseInputStyles}
`;

export const InputPassword = styled(AntdInput.Password)`
  ${baseInputStyles}
`;
