import { XClose } from '@untitled-ui/icons-react';
import { Checkbox, Collapse } from 'antd';
import { Menu } from 'src/components/common/menu/menu.tsx';
import { Page } from 'src/components/common/page/page.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled from 'styled-components';

const { Panel } = Collapse;

export const StyledCollapse = styled(Collapse)<{ isActive: boolean }>`
  ${(props) =>
    props.isActive
      ? `
      min-height: 370px;
      height: calc(100vh - 650px);
      max-height: 440px;    `
      : ``}
`;

export const StyledPanel = styled(Panel)`
    .ant-collapse-header {
        padding: 12px 6px 12px 14px !important;
    }

    .ant-collapse-content-box {
        padding-right: 6px !important;
        padding-left: 12px !important;
    }

    .ant-checkbox-wrapper {
        padding-left: 4px;
    }

    .ant-checkbox-wrapper:hover {

        .ant-checkbox {
            span {
                background-color: #e9f0f1 !important;
                border-color: ${(props) =>
                  props.theme.colors.components.colors.brandColor} !important;
            }

            :after {
                border-color: ${(props) =>
                  props.theme.colors.components.colors.brandColor} !important;
            }
        }
    }
}

`;

export const CommunityItems = styled(Stack)`
  min-height: 250px;
  height: calc(100vh - 770px);
  max-height: 320px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
`;

export const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked {
    span {
      background-color: #e9f0f1;
      border-color: ${(props) =>
        props.theme.colors.components.colors.brandColor};
    }

    :after {
      border-color: ${(props) =>
        props.theme.colors.components.colors.brandColor} !important;
    }
  }

  :hover {
    span {
      background-color: #e9f0f1 !important;
      border-color: ${(props) =>
        props.theme.colors.components.colors.brandColor} !important;
    }

    :after {
      border-color: ${(props) =>
        props.theme.colors.components.colors.brandColor} !important;
    }
  }
`;
export const StyledRangePicker = styled(Stack)`
  .ant-picker-input {
    width: 85px;
  }
`;

export const StyledRangePickerInit = styled(Stack)`
  max-width: 169px;
  max-height: 24px;
  position: relative;
  z-index: 0;

  .ant-picker {
    position: absolute;
    top: 0;
    z-index: 0;
  }

  .ant-btn {
    margin-top: -12px;
  }
`;

export const CloseIcon = styled(XClose)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #98a2b3;
`;

export const StyledPage = styled(Page.Content)`
  max-width: 650px;
  margin: 0 auto;
`;

export const StyledMenu = styled(Menu)`
  .ant-menu-submenu.ant-menu-submenu-inline {
    margin: 0 !important;
  }
`;

export const StyledScroll = styled.div`
  width: auto;
  height: calc(100vh - 68px - 68px);
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;
