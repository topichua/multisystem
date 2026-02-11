import { Tag01, XClose } from '@untitled-ui/icons-react';
import styled from 'styled-components';
import { Flex, Button, Tag } from 'antd';

export const StyledTag = styled.div`
  height: 36px;
  padding: 10px 10px 12px;
  border-radius: 36px;
  background: #f9fafb;
  border: 1px solid #eaecf0;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const StyledClose = styled(XClose)`
  width: 14px;
  height: 14px;
  color: #98a2b3;
  cursor: pointer;
`;

export const StyledTagIcon = styled(Tag01)`
  width: 18px;
  height: 18px;
  color: ${(props) => props.theme.colors.components.colors.mono900};

  path {
    stroke-width: 1.2;
  }
`;

export const StyledFilter = styled(Flex)`
  margin: 2px 0;

  path {
    stroke-width: 1.5;
  }
`;

export const TagButton = styled(Button)`
  border: 1px solid #ccdee1;
  background: #e9f0f1;
  width: 50px;
  height: 24px;
  padding: 4px 8px;
  border-radius: 44px;
`;

export const StyledTagLabel = styled(Tag)`
  height: 24px;
  padding: 1px 8px 7px;
  border-radius: 44px;
  background: #fafafa;
  border: 1px solid #eaecf0;
  margin-right: 4px;
  font-size: 12px;
  white-space: nowrap;
`;
