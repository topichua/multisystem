import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ExternalLink = styled(Link)<{ rightIcon?: boolean }>`
  color: #212121;
  text-decoration: underline !important;
`;

export const InternalLink = styled(Link)<{ rightIcon?: boolean }>`
  color: ${(props) => props.theme.colors.components.colors.brandColor};
  display: inline-flex;
  flex-direction: ${({ rightIcon }) => (rightIcon ? 'row-reverse' : 'row')};
  align-items: center;

  svg {
    ${({ rightIcon }) =>
      rightIcon ? 'margin-left: 8px' : 'margin-right: 8px'};
  }
`;
