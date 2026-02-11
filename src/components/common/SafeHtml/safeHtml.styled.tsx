import { components } from 'src/styled/definitions/colors';
import styled from 'styled-components';

export const HtmlContainer = styled.div`
  p {
    margin: 0;
  }

  img {
    max-width: 100%;
  }

  // to keep list styling
  ul {
    list-style-type: disc;
  }

  a {
    color: ${components.colors.brandColor};
    transition-property: opacity;
    transition-duration: 300ms;
    &:hover {
      color: ${components.colors.brandColor};
      opacity: 0.7;
    }

    &:visited {
      color: #4b3aa6;
    }
  }
`;
