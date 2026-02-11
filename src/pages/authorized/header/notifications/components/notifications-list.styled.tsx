import styled from 'styled-components';

export const NotificationsListContainer = styled.div<{ $isMobile?: boolean }>`
  height: ${({ $isMobile = false }) =>
    $isMobile ? 'calc(100vh - 100px)' : '500px'};
`;
