import { Tag } from 'src/components/common/Tag/Tag';
import { styled } from 'styled-components';

export const PostCover = styled.img`
  width: 100%;
  object-fit: contain;
`;

export const ReportedTag = styled(Tag)`
  padding: 0;
  position: absolute;
  top: 0px;
  right: 0;
  transform: translateX(50%);
  width: 22px !important;
  max-width: 22px !important;
  height: 22px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
`;
