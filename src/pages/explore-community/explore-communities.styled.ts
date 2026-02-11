import { Result } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import { styled } from 'styled-components';

export const StyledInnerPageHeader = styled.div`
  box-sizing: border-box;
  line-height: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  border-bottom: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  padding: 19px 36px 20px;
  min-height: 64px;
`;

export const ExploreButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.components.colors.green700};
`;

export const StyledResult = styled(Result)`
  path:nth-child(10) {
    fill: ${(props) => props.theme.colors.components.colors.green700};
  }
`;
