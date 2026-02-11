import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Button } from 'src/components/common/Button/Button';

export const StyledStatButton = styled(Button)`
  &:disabled:hover {
    cursor: default !important;
  }

  font-size: ${(props) => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.components.colors.gray900} !important;
  cursor: default !important;
`;

export const PostTitle = styled(Link)`
  color: ${(props) => props.theme.colors.components.colors.textColor};

  &:hover {
    color: ${(props) => props.theme.colors.components.colors.mono700};
  }
`;
