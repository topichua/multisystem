import { ArrowRight, XClose } from '@untitled-ui/icons-react';
import { Button as CommonButton } from 'src/components/common/Button/Button';
import styled from 'styled-components';
//import HeaderLogoImg from 'src/assets/bond_mx_logo.svg?react';

import config from 'src/projects/factory';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';

const HeaderLogoImg = config.logo;

export const HEADER_HEIGHT = 68;

export const HeaderPlaceholer = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

export const Header = styled.div`
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
`;

export const HeaderWrapper = styled.div`
  min-height: ${HEADER_HEIGHT}px;
  margin: 0 auto;
  padding: 6px 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderMenuButton = styled(CommonButton)`
  background: ${(props) =>
    props.theme.colors.components.background.primaryBackground};
  color: ${(props) => props.theme.colors.components.colors.primary};
  box-shadow: none;
  border: none;

  &&&:hover {
    background-color: ${(props) =>
      props.theme.colors.components.link.primaryBackgroundHover};
    color: white;
  }
`;

export const Button = styled(CommonButton)`
  @media (max-width: 1100px) {
    padding: 4px;
  }
`;

export const HeaderLogo = styled(HeaderLogoImg)`
  @media (min-width: 760px) and (max-width: 965px) {
    display: none !important;
  }
`;

export const LogoTour = styled(HeaderLogoImg)`
  transform: scale(1.25);
  padding-bottom: 10px;
  padding-left: 10px;
  padding-top: 10px;
`;

export const StyledTour = styled(Stack)`
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 20px 24px -4px #10182814;
  padding: 24px;
  max-width: 400px;
  border-radius: 12px;
`;

export const Description = styled(Stack)`
  width: 365px;
`;

export const DescriptionText = styled(Title)`
  padding: 0 10px 15px;
  font-weight: 400 !important;
`;

export const TitleText = styled(Title)`
  font-size: 18px !important;
  padding: 12px 12px 0;
`;

export const ArrowIcon = styled(ArrowRight)`
  padding-top: 6px;
  padding-left: 2px;
  height: 20px;
`;

export const CloseIcon = styled(XClose)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #98a2b3;
`;

export const Hidder = styled.div`
  width: 20px;
  height: 20px;
  background: white;
  position: absolute;
  bottom: 30px;
  left: 5px;
`;
