import { css, styled } from 'styled-components';
import { Card as CommonCard } from 'src/components/common/Card/Card';
import { Col, InputNumber } from 'antd';

export const CartCardContainer = styled(CommonCard)`
  &.ant-card {
    padding: 28px 24px;
    background-color: ${(props) =>
      props.theme.colors.components.background.lightGreenBackground};

    > .ant-card-head {
      padding: 0;
      margin-bottom: 24px;
      justify-content: normal;
      min-height: auto;
      line-height: 20px;
      color: ${(props) => props.theme.colors.components.colors.mono900};
    }

    > .ant-card-body {
      padding: 0;
    }
  }
`;

export const TicketListContainer = styled(CommonCard)`
  > .ant-card-body {
    padding: 10px 12px;
  }
`;

export const TicketInfoContainer = styled(Col)<{ isRowWrapped?: boolean }>`
  ${(props) =>
    props.isRowWrapped &&
    css`
      margin-bottom: 8px;
    `}

  color: ${(props) => props.theme.colors.components.colors.green900};
  font-style: normal;
  line-height: 20px;

  > h5:first-child {
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }

  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const QuantityInput = styled(InputNumber)`
  width: 100%;
`;
