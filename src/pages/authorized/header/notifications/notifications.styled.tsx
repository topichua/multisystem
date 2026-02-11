import { Badge as AntBadge, Tabs as AntTabs, Row, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import styled from 'styled-components';

const { Text } = Typography;

export const PopoverContentWrapper = styled(Row)`
  padding: 16px 16px 0 12px;
`;

export const PopoverTitle = styled(Text)`
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.extraLarge};
  color: #101828;
`;

export const Badge = styled(AntBadge)`
  .ant-badge-count {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const Tabs = styled(AntTabs)<{ $isMobile?: boolean }>`
  & .ant-tabs-nav {
    margin-left: ${({ $isMobile }) => ($isMobile ? '16px' : '0px')};
  }
`;

export const MarkAllAsRead = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
`;
