import { Col } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import styled from 'styled-components';

export const ViewCommunityButton = styled(Button)`
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing.normal} !important;
  padding-right: ${(props) => props.theme.spacing.normal} !important;
`;

export const StyledCol = styled(Col)`
  & > .ant-ribbon-wrapper {
    height: 100% !important;
  }
`;

export const LeaveDropdown = styled.div`
  width: 100%;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadow.small};
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
`;
