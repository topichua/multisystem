import { Card as AntdCard } from 'antd';
import styled from 'styled-components';

export const Card = styled(AntdCard)`
  padding: 36px 0;
  box-shadow: none !important;
  border-radius: 0 !important;

  &:not(:last-child) {
    border-bottom: 1px solid #eaecf0;
  }

  .ant-card-body {
    padding: 0;
  }

  .info {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    gap: 12px;
    margin-top: 32px;
    overflow: hidden;

    & .ant-tag {
      flex-shrink: 0;
    }
  }

  .link {
    transition: opacity 350ms ease;
  }

  .link:focus-visible,
  .link:hover {
    opacity: 0.75;
  }

  .description {
    margin: 8px 0 0;
    font-size: ${(props) => props.theme.fontSize.large};
    line-height: 24px;
    font-weight: 500;
    color: #667085;
  }

  .user {
    margin-bottom: 8px;
  }

  .content-row {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 60px;
  }

  .content-row--thumb-start {
    flex-flow: row nowrap;
  }

  .content-main {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .content-img {
    flex-shrink: 0;

    @media (max-width: 700px) {
      display: none;
    }

    @media (min-width: 701px) {
      min-width: 120px;
    }
  }

  .content-img img {
    display: block;
    border-radius: 8px;
    object-fit: cover;
  }
`;
