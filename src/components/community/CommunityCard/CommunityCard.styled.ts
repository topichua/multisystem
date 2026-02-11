import { styled } from 'styled-components';
import { Badge as AntdBadge } from 'antd';

import { Card as CommonCard } from 'src/components/common/Card/Card';

export const Card = styled(CommonCard)<{
  canNavigate?: boolean;
  bgColor?: string;
}>`
  overflow: hidden;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.ant-card {
    background: ${(props) => (props.bgColor ? props.bgColor : 'default')};
    padding-bottom: ${(props) => props.theme.spacing.extraTight};
  }

  .info {
    color: ${(props) => props.theme.colors.components.colors.mono500};
    font-size: ${(props) => props.theme.fontSize.small};
  }

  .cursor-pointer {
    cursor: ${(props) => (props.canNavigate ? 'pointer' : 'default')};
  }

  .ant-card-actions {
    background: ${(props) => (props.bgColor ? props.bgColor : 'default')};

    border: none;
    padding: 8px 16px 16px;

    & li {
      margin: 0;
      margin-right: 8px;
      width: auto !important;
      border-inline-end: 0 !important;

      &:first-child {
        flex-grow: 1;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export const Badge = styled(AntdBadge.Ribbon)<{ showBadge?: boolean }>`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 20px;
  display: flex;
  align-items: center;
  visibility: ${(props) => (props.showBadge ? 'visible' : 'hidden')};

  .ant-ribbon-wrapper {
    height: 100% !important;
  }
`;
