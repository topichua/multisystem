import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { styled } from 'styled-components';

export const StyledTime = styled(Stack)`
  div {
    width: 100%;

    .ant-form-item-explain-error {
      font-size: 11px;
      font-weight: bold;
    }
  }
`;

export const StyledSelectLabel = styled(Stack)`
  div {
    display: inherit;
  }
`;

export const StyledInputsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const StyledSelectText = styled(Stack)`
  div {
    white-space: normal !important;
  }
`;

export const RSVPContainer = styled(Stack)`
  div {
    width: 100%;

    .ant-form-item-explain-error {
      font-size: 11px;
      font-weight: bold;
    }
  }

  div:nth-child(2) {
    flex: 1;

    button {
      margin-top: 6px;

      svg {
        color: #656565;

        path {
          stroke-width: 1.7;
        }
      }
    }
  }
`;
