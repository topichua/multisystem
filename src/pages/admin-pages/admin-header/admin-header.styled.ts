import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';
import { styled } from 'styled-components';

export const HeaderPlaceholder = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

export const HeaderWrapper = styled.div`
  position: fixed;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  width: 100%;
  padding: 6px 36px;
  align-items: center;
  box-sizing: border-box;
  z-index: 999;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.components.border.primaryBorder};
`;
