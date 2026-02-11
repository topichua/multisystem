import { Flex, Typography } from 'antd';
import styled from 'styled-components';

import { Tag } from 'src/components/common/Tag/Tag';

const { Text } = Typography;

export const OriginalPosterLabel = () => {
  return (
    <Tag
      size="small"
      icon={
        <StyledIcon align="center" justify="center">
          OP
        </StyledIcon>
      }
      color="#e4eef2"
      style={{ margin: 0 }}
    >
      <StyledText>Original poster</StyledText>
    </Tag>
  );
};

const StyledIcon = styled(Flex)`
  width: 14px;
  height: 14px;
  background: #498ea6;
  border-radius: 50%;
  color: #e4eef2;
  font-size: 8px;
  font-weight: 600;
`;

const StyledText = styled(Text)`
  color: #498ea6;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.small};
`;
