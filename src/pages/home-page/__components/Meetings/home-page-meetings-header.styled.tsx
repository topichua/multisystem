import { Flex } from 'antd';
import styled from 'styled-components';

export const UpcomingMeetingsHeader = styled(Flex)<{
  $isOpen: boolean;
}>`
  width: 100%;
  position: ${({ $isOpen }) => ($isOpen ? 'sticky' : 'relative')};
  border-radius: ${({ theme }) => theme.radius.large} !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  top: 0;
  z-index: 1;
  background-color: white;
  transition:
    padding 0.3s ease,
    background-color 0.3s ease;
`;
