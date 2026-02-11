import styled from 'styled-components';
import { HEADER_HEIGHT } from './header.styled';

export const Header = styled.div`
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT}px;
  padding: 6px 16px;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.05);
`;

export const HeaderPlaceholer = styled.div`
  height: ${HEADER_HEIGHT}px;
`;
