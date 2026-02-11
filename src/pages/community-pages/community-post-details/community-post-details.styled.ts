import { styled } from 'styled-components';

export const Wrapper = styled.div<{ disabled?: boolean; closed?: boolean }>`
  ${(props) =>
    props.disabled &&
    `
        opacity: 0.5;
    `}

  ${(props) =>
    (props.disabled || props.closed) &&
    `
        pointer-events: none;
    `}
`;
