import * as React from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import * as colorsDefinition from './definitions/colors';
import { text, bigText } from './definitions/fontSize';
import { spacingDefinition } from './definitions/spacing';
import { radiusDefinition } from './definitions/radius';
import { shadowDefinition } from './definitions/shadows';

export const THEME: DefaultTheme = {
  spacing: spacingDefinition,
  fontSize: text,
  bigTextFontSize: bigText,
  colors: colorsDefinition,
  radius: radiusDefinition,
  shadow: shadowDefinition,
};

export function Theme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={THEME}>{children}</ThemeProvider>;
}
