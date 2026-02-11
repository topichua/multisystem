import { styled } from 'styled-components';
import { Tabs as TabsAnt } from 'antd';

export const Tabs = styled(TabsAnt)`
  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-nav {
    margin: 0;

    &::before {
      border-bottom: none;
    }

    .ant-tabs-tab {
      padding: ${(props) =>
        `${props.theme.spacing.tight} ${props.theme.spacing.normal}`};
      border-radius: 6px;
      transition: 0.2s;
      margin: 0;

      &-active {
        background-color: ${(props) =>
          props.theme.colors.components.background.mono100};
      }
    }
  }
`;
