import styled from 'styled-components';
import { Typography } from 'antd';

const { Title: AndTitle } = Typography;

type TitleProps = {
  fontWeight?: 400 | 500 | 600 | 700 | 800;
};

export const Title = styled(AndTitle)<TitleProps>`
  &:is(h1, h2, h3, h4, h5, h6) {
    margin: 0 !important;
    font-weight: ${(props) => props.fontWeight ?? 700};
  }
`;
