import React from 'react';
import {
  BannerItem,
  BannerTextContainer,
  BannerButton,
  CarouselContainer,
} from './events-home-carousel.styled';

const CarouselBanner: React.FC = () => {
  const banners = [
    {
      image: 'https://picsum.photos/id/1011/1080/280',
      title: 'A huge feature event is coming!',
      description: 'Book your tickets now.',
      buttonText: 'View more',
    },
    {
      image: 'https://picsum.photos/id/1012/1080/280',
      title: 'Explore the amazing countryside.',
      description: 'Plan your next adventure with us.',
      buttonText: 'Discover',
    },
    {
      image: 'https://picsum.photos/id/1013/1080/280',
      title: 'Luxury meets comfort.',
      description: 'Experience world-class hospitality.',
      buttonText: 'Learn more',
    },
  ];

  return (
    <CarouselContainer>
      {banners.map((banner, index) => (
        <BannerItem key={index} image={banner.image}>
          <BannerTextContainer>
            <h1>{banner.title}</h1>
            <p>{banner.description}</p>
            <BannerButton>{banner.buttonText}</BannerButton>
          </BannerTextContainer>
        </BannerItem>
      ))}
    </CarouselContainer>
  );
};

export default CarouselBanner;
