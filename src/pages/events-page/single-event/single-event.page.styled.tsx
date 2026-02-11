import styled from 'styled-components';
import { Avatar, Typography } from 'antd';
import { Card } from 'src/components/common/Card/Card';
import { Stack } from 'src/components/common/Stack/Stack';
import Paragraph from 'antd/es/typography/Paragraph';

const { Text: AntdText } = Typography;

export const Text = styled(AntdText)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
`;

export const SectionCard = styled(Card)<{ titleHasBottomMargin?: boolean }>`
  .ant-card-body {
    padding: 28px 24px;
    word-break: break-word;

    > p:first-child {
      margin: 0;
      margin-bottom: ${({ titleHasBottomMargin = false }) =>
        titleHasBottomMargin ? '16px' : 0};
      color: ${(props) => props.theme.colors.components.colors.mono900};
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
    }
  }
`;

export const SectionDescription = styled.span`
  color: ${(props) => props.theme.colors.components.colors.gray600};
  display: block;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 150%;
  letter-spacing: 0.16px;
  margin: 16px 0;
`;

export const ContentWrapper = styled.div`
  img {
    max-width: 100%;
  }
`;

export const SectionIconDetails = styled.div`
  margin-top: 4px;

  > div {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .sub-details-text {
    color: ${(props) => props.theme.colors.components.colors.gray600};
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    margin-bottom: 16px;

    &.venue {
      color: ${(props) => props.theme.colors.components.colors.brandColor};
      text-overflow: ellipsis;
      font-weight: 600;
    }
  }

  .external-link {
    color: ${(props) => props.theme.colors.components.colors.linkColor};
    font-weight: 600;
    line-height: 16px;
    text-decoration: underline;
    text-decoration-color: ${(props) =>
      props.theme.colors.components.colors.linkColor};
  }
`;

export const SectionContentCard = styled(Card)`
  border-radius: 8px;
  background: ${(props) =>
    props.theme.colors.components.background.tagBackgroundColor};

  .ant-card-body {
    padding: 16px;

    .ant-typography {
      &:not(.paragraph-block) {
        display: inline;
        margin-left: 16px;
        color: ${(props) => props.theme.colors.components.colors.gray900};
        font-size: 16px;
        font-weight: 600;
        line-height: 150%;
        font-style: normal;
      }
    }
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: clamp(48px, 10vw + 16px, 72px);
  height: clamp(48px, 10vw + 16px, 72px);
`;

export const StackPresenterDetails = styled(Stack)`
  padding: 10px 0;
  line-height: 150%;

  .presenter {
    &-name {
      color: ${(props) => props.theme.colors.components.colors.gray900};
      font-size: 18px;
      font-weight: 600;
    }

    &-role {
      color: ${(props) => props.theme.colors.components.colors.mono500};

      font-size: 16px;
      font-weight: 500;
    }
  }
`;

export const StyledParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.colors.components.colors.gray600};
  font-size: 16px;
  font-weight: 300;
  line-height: 150%;
  letter-spacing: 0.16px;
`;

export const AdditionalInfoContents = styled(Stack)`
  .content-header {
    color: ${(props) => props.theme.colors.components.colors.mono500};
    font-size: 14px;
    font-weight: 500;
    line-height: 175%;
    letter-spacing: 0.14px;
  }
`;
