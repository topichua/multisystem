import * as React from 'react';
import * as S from './menu.styled.tsx';
import { MenuProps } from 'antd';
export { MenuLabel } from './menu-label';

export const Menu: React.FC<MenuProps> = (props) => {
  return <S.Menu inlineIndent={0} {...props} />;
};
