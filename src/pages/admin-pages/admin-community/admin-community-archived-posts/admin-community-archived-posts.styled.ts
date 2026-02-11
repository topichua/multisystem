import { styled } from 'styled-components';

export const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing.extraLoose};
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  border-radius: 10px;
`;
