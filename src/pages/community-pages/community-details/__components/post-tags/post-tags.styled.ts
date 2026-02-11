import { Typography } from 'antd';
import styled from 'styled-components';

import { Tag } from 'src/components/common/Tag/Tag';

const { Text } = Typography;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.normal};
`;

export const StyledHeader = styled(Text)`
  line-height: 21px;
  font-weight: 400;
  display: inline-block;
  margin-bottom: 5px;
`;

export const StyledTag = styled(Tag)`
  color: #344054 !important;
  border-radius: 16px;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-weight: 500;
`;
