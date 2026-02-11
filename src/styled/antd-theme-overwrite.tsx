import { components } from './definitions/colors';

export const globalToken = {
  colorPrimary: components.colors.primary,
  colorText: components.colors.textColor,
  fontFamily: 'Manrope',
  colorLink: components.colors.defaultLinkColor,
};

export const componentsToken = {
  Avatar: {
    colorTextPlaceholder: components.background.avatarBackground,
  },
  Layout: {
    bodyBg: components.background.whiteBackground,
    siderBg: components.background.whiteBackground,
  },
  Typography: {
    colorText: components.colors.textColor,
  },
  Menu: {
    itemSelectedBg: components.background.primaryBackground,
    itemActiveBg: components.background.primaryBackground,
    itemHoverBg: components.background.primaryBackground,
  },
  Select: {
    optionActiveBg: components.background.primaryBackground,
    optionSelectedBg: components.background.primaryBackground,
  },
};
