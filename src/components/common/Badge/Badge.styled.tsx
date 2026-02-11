import styled from 'styled-components';
import { XClose } from '@untitled-ui/icons-react';

const getPaddings = (size: string) => {
  switch (size) {
    case 'small':
      return '2px 6px ';
    case 'default':
      return '8px 8px 8px 12px';
    default:
      return '8px 12px';
  }
};

export const BadgeStyled = styled.div<{ allClicable?: boolean; size: string }>`
  display: flex;
  align-items: center;
  width: max-content;
  gap: 4px;
  border-radius: 36px;
  border: 1px solid #eaecf0;
  background: #f9fafb;
  cursor: ${(props) => (props.allClicable ? 'pointer' : 'auto')};
  padding: ${(props) => getPaddings(props.size)};

  font-size: ${(props) => (props.size === 'small' ? '12px' : '14px')};
`;

export const CloseIcon = styled(XClose)`
  width: 12px;
  height: 12px;
  cursor: pointer;
  color: #98a2b3;
`;
