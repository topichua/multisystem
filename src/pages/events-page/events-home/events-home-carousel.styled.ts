import styled from 'styled-components';
import { Carousel } from 'antd';

export const CarouselContainer = styled(Carousel).attrs(() => ({
  autoplay: true,
  dotPosition: 'bottom',
}))`
  .slick-slider,
  .slick-list,
  .slick-slide > div {
    border-radius: 12px;
    overflow: hidden;
  }

  .slick-dots {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    margin-left: 36px;
    bottom: 36px;
  }
`;

export const BannerItem = styled.div<{ image: string }>`
  display: flex;
  width: 100%;
  height: 280px;
  padding: 36px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  color: white;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%),
    url(${(props) => props.image}) center / cover no-repeat;
`;

export const BannerTextContainer = styled.div`
  max-width: 50%;
  z-index: 1;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1.2;
  }

  p {
    margin: 8px 0 0;
    font-size: 16px;
  }
`;

export const BannerButton = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;
