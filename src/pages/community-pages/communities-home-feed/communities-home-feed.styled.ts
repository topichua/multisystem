import { styled } from 'styled-components';

import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';
import { INNER_HEADER_HEIGHT } from 'src/components/common/Inner-page-header/inner-page-header';

export const StackContainer = styled.div`
  gap: ${(props) => props.theme.spacing.normal};
  max-height: calc(100vh - ${HEADER_HEIGHT + INNER_HEADER_HEIGHT}px);
  overflow: auto;
  padding: ${(props) =>
    `${props.theme.spacing.extraLoose} ${props.theme.spacing.loose}`};
`;
