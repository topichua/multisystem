import styled from 'styled-components';

export const ScrollWrapper = styled.div<{ align?: boolean }>`
  max-width: 100%;
  display: flex;
  flex-wrap: no-wrap;
  justify-content: ${(props) => (props.align ? 'center' : 'flex-start')};
  gap: ${(props) => props.theme.spacing.normal};
  overflow-x: auto;

  & > div {
    flex: 0 0 300px;
  }
`;

export const Icon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
