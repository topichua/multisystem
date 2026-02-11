import styled from 'styled-components';

import { Card } from 'src/components/common/Card/Card';

export const HostCard = styled(Card)`
  background-color: ${(props) =>
    props.theme.colors.components.background.mono25};
`;
