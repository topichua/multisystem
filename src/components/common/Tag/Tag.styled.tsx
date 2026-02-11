import { Tag as AntdTag } from 'antd';
import styled, { css } from 'styled-components';

export type StyledTagProps = {
  size?: 'small' | 'default' | 'large';
  isTextBold?: boolean;
};

const sharedStyles = css<StyledTagProps>`
  font-size: ${(props) => props.theme.fontSize.medium};
  padding: ${(props) => {
    switch (props.size) {
      case 'small':
        return '2px 8px';
      case 'large':
        return '8px 16px';
      default:
        return '4px 12px';
    }
  }};
  border-radius: ${(props) => props.theme.radius.extraLarge};
  background-color: ${(props) =>
    props.theme.colors.components.background.tagBackgroundColor};
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-inline-end: 0;
  display: flex;
  align-items: center;
  max-width: max-content;

  ${({ isTextBold }) =>
    (isTextBold ?? false) &&
    `font-size: 14px; 
     font-weight: 700; 
     line-height: 20px;`}

  .anticon + span {
    margin-inline-start: ${(props) => {
      switch (props.size) {
        case 'small':
          return '4px';
        case 'large':
          return '12px';
        default:
          return '8px';
      }
    }};
  }
`;

export const Tag = styled(AntdTag).withConfig({
  shouldForwardProp: (prop) => prop !== 'isTextBold' && prop !== 'size',
})<StyledTagProps>`
  ${sharedStyles}
`;

export const CheckableTag = styled(AntdTag.CheckableTag)<StyledTagProps>`
  ${sharedStyles}

  &.ant-tag-checkable-checked {
    background-color: ${(props) =>
      props.theme.colors.components.colors.primary};
  }
`;
