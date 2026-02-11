import styled from 'styled-components';
import { List as AntList } from 'antd';

export const ListItem = styled.div`
  width: 100%;
  padding: 10px;
`;

export const PostInfoWrapper = styled.div`
  flex-direction: row;
  display: flex;
  gap: 10px 10px;
  align-items: center;
`;

export const PostTextWrapper = styled.div`
  position: relative;
  width: calc(100% - 12px);
`;

export const PostTitle = styled.span`
  font-size: ${(props) => props.theme.fontSize.large};
  font-weight: 600;
`;

export const PostSubTitle = styled.div`
  font-size: ${(props) => props.theme.fontSize.medium};
  font-weight: 400;
  line-height: 20px;
  margin: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 40px);
`;

export const StyledList: typeof AntList = styled(AntList)`
  border: 1px solid #eaecf0 !important;
`;
