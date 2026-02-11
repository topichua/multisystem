import { Checkbox, MenuProps, Radio } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Menu as CommonMenu } from 'src/components/common/menu/menu';
import styled from 'styled-components';

export const SeeAllButton = styled(Button)`
  margin: -16px 0 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #004c58;
`;

export const MenuStyled = styled((props: MenuProps) => (
  <CommonMenu {...props} />
))`
  .ant-menu-sub {
    background-color: transparent !important;
  }

  .ant-menu-submenu-title {
    h5 {
      font-size: 14px !important;
      font-weight: 700;
      line-height: 20px;
      color: ${(props) => props.theme.colors.components.colors.mono900};
    }

    svg {
      path {
        stroke-width: 1.3;
      }
    }
  }

  .ant-menu {
    li {
      height: 30px;
    }

    li:first-child {
      height: 44px;
      margin-bottom: 15px;

      &:hover {
        background-color: white !important;
      }
    }

    margin-bottom: 10px;
  }
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

export const StyledRadio = styled(Radio)`
  .ant-radio-input {
    border-color: #d0d5dd !important;
    background-color: white !important;
  }

  .ant-radio-checked {
    border-color: #005b6a !important;
    background-color: #e9f0f1 !important;

    .ant-radio-inner {
      border-color: #005b6a !important;
      background-color: #e9f0f1 !important;

      &::after {
        background: #005b6a !important;
      }
    }
  }
`;
