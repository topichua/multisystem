import { Typography } from 'antd';
import { styled } from 'styled-components';

import { Card as CommonCard } from '../Card/Card';

const { Paragraph } = Typography;

export const Card = styled(CommonCard)`
  .username {
    font-weight: 600;
  }

  .secondary {
    font-size: ${(props) => props.theme.fontSize.small};
    color: ${(props) => props.theme.colors.components.colors.gray600};
    line-height: 16px;
  }

  .title {
    margin-top: ${(props) => props.theme.spacing.extraLoose};

    a {
      color: ${(props) => props.theme.colors.components.colors.textColor};
    }
  }
`;

export const ExpandableHtmlWrapper = styled(Paragraph)`
  & * .html-container * {
    font-size: ${(props) => props.theme.fontSize.medium} !important;
    line-height: 1.5 !important;
    font-weight: 500 !important;
    text-align: left !important;

    & br {
      display: none;
    }
  }
`;
