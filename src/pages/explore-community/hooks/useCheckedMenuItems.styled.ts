import { Checkbox } from 'antd';
import styled from 'styled-components';

export const StyledCheckbox = styled(Checkbox)`
  margin-left: 15px;

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

export const StyledCheckboxMain = styled(Checkbox)`
    .ant-checkbox-checked {
        span {
            background-color: #ccdee1;
            border-color: ${(props) =>
              props.theme.colors.components.colors.brandColor};
        }

        :after {
            border-color: ${(props) =>
              props.theme.colors.components.colors.brandColor} !important;
        }
    }

    .ant-checkbox-indeterminate {
        .ant-checkbox-inner {
            background-color: #ccdee1 !important;
            border-color: ${(props) =>
              props.theme.colors.components.colors.brandColor} !important;

            span {
                background-color: #ccdee1;
                border-color: ${(props) =>
                  props.theme.colors.components.colors.brandColor};
            }
        }

        :after {
            background-color: ${(props) =>
              props.theme.colors.components.colors.brandColor};
            height: 1px;
            border-radius: 25px;
        }
    }

    :hover {
        span {
            background-color: #ccdee1 !important;
            border-color: ${(props) =>
              props.theme.colors.components.colors.brandColor} !important;
        }

        :after {
            border-color: ${(props) =>
              props.theme.colors.components.colors.brandColor} !important;
        }
    }
}
`;
