import { Button, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const MeetingsTitle = styled(Title)`
  margin: 0 !important;
  line-height: 1;
  font-weight: 700 !important;
`;

export const ExpandButton = styled(Button)<{ $isOpen: boolean }>`
  & * {
    color: ${({ theme }) =>
      `${theme.colors.components.colors.brandColor} !important`};
    font-weight: bold !important;
  }

  display: flex;
  align-items: center;

  svg {
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;
