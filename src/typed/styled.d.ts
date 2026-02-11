// import original module declarations
import 'styled-components';

// import all needed definitions
import * as colorsDefinition from '../styled/definitions/colors';
import { text, bigText } from '../styled/definitions/fontSize';
import { spacingDefinition } from '../styled/definitions/spacing';
import { radiusDefinition } from '../styled/definitions/radius';
import { shadowDefinition } from '../styled/definitions/shadows';

// and extend styled-components!
declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: typeof spacingDefinition;
    fontSize: typeof text;
    bigTextFontSize: typeof bigText;
    colors: typeof colorsDefinition;
    radius: typeof radiusDefinition;
    shadow: typeof shadowDefinition;
  }
}
