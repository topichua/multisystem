import config from 'src/projects/factory';

export const components = {
  colors: {
    primary: config.brandColor,
    textColor: '#344054',
    whiteTextColor: '#ffffff',
    defaultLinkColor: config.brandColor,
    brandColor: config.brandColor,
    linkColor: config.brandColor,
    mono500: '#667085',
    mono700: '#667085',
    mono800: '#1d2939',
    mono900: '#212329',
    iconFillBrandColor: '#D5EFED',
    successColor: '#17B26A',
    gray300: '#D0D5DD',
    gray600: '#475467',
    green700: '#1d756d',
    green900: '#004C58',
    gray900: '#101828',
    orange: '#F04C3A',
  },

  background: {
    primaryBackground: '#EAF7F6',
    whiteBackground: '#ffffff',
    tagBackgroundColor: '#f9fafb',
    avatarBackground: 'rgba(191, 191, 191, 1)',
    yellow: 'rgb(255, 252, 245)',
    mono100: '#F2F4F7',
    mono25: '#FCFCFD',
    lightGreenBackground: '#E9F0F1',
    greenBackground07: '#b2c9cd',
  },

  link: {
    primaryBackgroundHover: config.brandColor,
  },
  badge: {
    purple: '#412D93',
    yellow: '#A0862B',
    gray: '#344054',
  },
  border: {
    primaryBorder: '#eaecf0',
    greenBorder: '#17B26A',
    whiteBorder: '#ffffff',
    yellowBorder: 'rgb(254, 223, 137)',
  },
};
