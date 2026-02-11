import { styled } from 'styled-components';
import { Typography } from 'antd';

import { Card as CommonCard } from 'src/components/common/Card/Card';

const { Text } = Typography;

export const Card = styled(CommonCard)`
  &.ant-card {
    overflow: hidden;
  }

  .ant-card-body {
    padding: 0;
    padding-bottom: ${(props) => props.theme.spacing.normal};
  }
`;

export const UserInfo = styled.div`
  transform: translateY(30px);
`;

export const Header = styled.div`
  background-color: ${(props) =>
    props.theme.colors.components.colors.iconFillBrandColor};
  padding: 0 ${(props) => props.theme.spacing.normal};
  padding-top: 16px;
`;

export const NameText = styled(Text)`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.extraLarge};
  color: ${(props) => props.theme.colors.components.colors.brandColor};
`;

export const Body = styled.div`
  padding: 0 ${(props) => props.theme.spacing.loose};
  padding-top: 54px;
`;

export const InfoText = styled(Text)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
`;
