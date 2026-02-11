import { styled } from 'styled-components';

export const List = styled.div<{ hasPadding?: boolean }>`
  padding-left: ${(props) => (props.hasPadding ? 50 : 0)}px;
`;
