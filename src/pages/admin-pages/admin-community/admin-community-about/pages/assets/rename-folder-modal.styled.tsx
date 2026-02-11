import { Tag } from 'antd';
import styled from 'styled-components';

export const IconTagWrapper = styled(Tag)`
  & svg {
    height: 15px !important;
    width: 25px !important;
    font-size: 25px !important;
  }
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
`;
