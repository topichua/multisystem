import { Button, Skeleton, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const StyledLinkText = styled(Text)`
  color: ${({
    theme: {
      colors: {
        components: {
          colors: { linkColor },
        },
      },
    },
  }) => linkColor};

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledSkeleton = styled(Skeleton)`
  & .ant-skeleton-paragraph {
    margin: 0 !important;
  }
`;

export const StyledButton = styled(Button)`
  & .ant-btn-icon {
    padding-top: 2.5px;
  }
`;
