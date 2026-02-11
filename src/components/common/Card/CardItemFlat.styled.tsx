import { Card as AntdCard, Typography } from 'antd';
import styled from 'styled-components';

export const Card = styled(AntdCard)`
  margin: 12px;
  height: 100%;
  min-width: 230px;
  width: auto;
  background: #fcfcfd;
  border-color: #fcfcfd;
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out;

  .ant-card-body {
    padding: 8px;
  }

  path {
    stroke-width: 1.33;
  }

  &:hover {
    box-shadow:
      0 1px 20px rgba(0, 0, 0, 0.05),
      0 3px 15px 0 rgba(0, 0, 0, 0.05);
  }
`;

export const CoverImage = styled.img`
  max-width: 100%;
  width: 320px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
`;

export const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  padding: 5px;
  width: 32px;
  height: 32px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: ${(props) => props.theme.radius.normal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Author = styled(Typography.Text)`
  color: #686868 !important;
  font-family: Manrope, sans-serif;
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  position: absolute;
  bottom: 16px;
  left: 16px;
`;

export const Title = styled(Typography.Paragraph)`
  color: #565656;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  margin: 0 !important;
`;

export const AdditionalInformation = styled(Typography.Paragraph)`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #00000073;
  margin-bottom: 22px !important;
`;
