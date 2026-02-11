import { Card } from 'antd';
import styled from 'styled-components';

import { Page } from 'src/components/common/page/page';

export const StyledInnerCard = styled(Card)`
  position: relative;
  margin: 12px 0 15px;

  & .ant-card-body {
    padding-bottom: 15px;
    padding-top: 15px;
  }

  &:hover {
    & .vertical-line {
      background-color: #259289 !important;
    }
  }
`;

export const StylePageContent = styled(Page.Content)`
  align-items: center !important;
  width: 100%;
  background-color: transparent !important;
  position: relative;
`;
