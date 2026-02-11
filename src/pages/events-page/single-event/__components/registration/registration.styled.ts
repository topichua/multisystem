import { styled } from 'styled-components';
import { InputNumber as AntdInputNumber } from 'antd';

import { Card as CommonCard } from 'src/components/common/Card/Card';

export const Card = styled(CommonCard)`
  &.ant-card {
    background-color: ${(props) =>
      props.theme.colors.components.background.primaryBackground};
  }

  .ant-card-head {
    border-bottom: 1px solid
      ${(props) => props.theme.colors.components.border.whiteBorder};
  }
`;

export const InputNumber = styled(AntdInputNumber)`
  .ant-input-number-prefix {
    color: ${(props) => props.theme.colors.components.colors.gray300};
  }
`;
