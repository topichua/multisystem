import styled from 'styled-components';
import { Stack } from 'src/components/common/Stack/Stack';

export const SessionRow = styled(Stack)`
  margin-right: 60px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.16px;

  .session {
    &-text {
      color: ${(props) => props.theme.colors.components.colors.textColor};
      font-weight: 300;
    }

    &-time {
      color: ${(props) => props.theme.colors.components.colors.green900};
      text-align: right;
    }
  }
`;
