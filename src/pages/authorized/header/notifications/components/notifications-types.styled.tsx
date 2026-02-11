import { Button, List, Tag, Typography } from 'antd';
import { Link as RLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { components } from 'src/styled/definitions/colors';
// import { components as UIcomponents } from 'src/ui-components/src/styled/definitions/colors';

import { Stack } from 'src/components/common/Stack/Stack';
import { NOTIFICATIONS_MAIN_COLOR_HOVER } from '../utils/colors';

export const Link = styled(RLink)`
  color: ${components.colors.brandColor} !important;

  &:hover {
    color: ${NOTIFICATIONS_MAIN_COLOR_HOVER} !important;
  }
`;

export const ListItem = styled(List.Item)`
  &:hover {
    background-color: #fafafa;
  }
`;

export const Date = styled(Typography.Text)`
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSize.small};
  color: #667085;
`;

export const ListItemMeta = styled(List.Item.Meta)`
  .ant-list-item-meta-title {
    margin-bottom: 5px !important;
    line-height: 1 !important;
  }
`;

const blockLabelCss = css`
  & > * {
    display: block;
  }
`;

const noBlockLabelCss = css`
  margin-left: 5px;
  margin-right: 3px;
`;

export const StyledLabel = styled.span<{ $isBlock?: boolean }>`
  ${({ $isBlock = true }) => {
    return $isBlock ? blockLabelCss : noBlockLabelCss;
  }}
`;

export const StyledTag = styled(Tag)`
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 5px;
  margin-right: 1px;

  > span {
    height: 16px;
  }
`;

export const StyledReportLabel = styled(Tag)`
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  padding: 4px 6px 4px 6px !important;
  margin-left: 6px;
  margin-right: 4px;
  justify-content: center;

  > span {
    height: 14px;
    margin: 0px !important;
  }
`;

export const StyledTotalContainer = styled(Stack)`
  display: inline-flex !important;
`;

export const StyledTotalTag = styled(StyledTag)`
  gap: 10px;
  > span {
    height: 20px;
  }

  & * {
    line-height: 20px !important;
  }
`;
export const StyledAsset = styled(Stack)`
  svg {
    height: 20px;
    width: 20px;
  }
`;

export const MarkButton = styled(Button)<{ $notificationSeen?: boolean }>`
  &:hover:not(:disabled) {
    border-color: ${({
      theme: {
        colors: {
          components: {
            colors: { brandColor },
          },
        },
      },
    }) => brandColor} !important;
    background-color: ${components.background.primaryBackground} !important;
  }

  & path {
    fill-opacity: ${({ $notificationSeen = false }) =>
      $notificationSeen ? '0.01 !important' : '1 !important'};

    fill: ${({
      $notificationSeen = false,
      theme: {
        colors: {
          components: {
            colors: { brandColor },
          },
        },
      },
    }) => ($notificationSeen ? 'transparent' : brandColor)};
  }
`;
