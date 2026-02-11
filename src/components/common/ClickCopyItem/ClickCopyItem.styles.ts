import { styled } from 'styled-components';
import { Copy03 } from '@untitled-ui/icons-react';
import { Stack } from '../Stack/Stack';

export const StyledStack = styled(Stack)<{ $color?: string }>`
  cursor: pointer;
  color: ${(props) =>
    props.$color
      ? props.$color
      : props.theme.colors.components.colors.green900};

  .ant-typography {
    color: ${(props) =>
      props.$color
        ? props.$color
        : props.theme.colors.components.colors.green900};
  }
`;

export const CopyButton = styled(Copy03)`
  cursor: pointer;
`;
