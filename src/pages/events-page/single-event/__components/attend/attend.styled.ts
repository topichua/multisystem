import { styled } from 'styled-components';

export const List = styled.ul`
  padding-inline-start: 20px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.extraTight};
  color: ${(props) => props.theme.colors.components.colors.gray600};
`;
