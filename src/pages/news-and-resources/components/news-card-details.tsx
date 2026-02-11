import {
  ArrowLeft,
  ArrowNarrowLeft,
  ArrowNarrowRight,
} from '@untitled-ui/icons-react';
import { useSize } from 'ahooks';
import { Button, Flex, Image, Skeleton, Typography } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';
import { TitleProps } from 'antd/es/typography/Title';
import { FC, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Stack } from 'src/components/common/Stack/Stack';
import { pagesMap } from 'src/pages/authorized/routes';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { ResourceDTO } from 'src/transport/news/news.dto';

import 'swiper/css/bundle';
import 'swiper/css/navigation';

import * as U from '../utils/utils';

const { Title, Text } = Typography;

interface IBaseType {
  isLoading?: boolean;
}

export const StyledTitle = styled(Title)`
  margin-bottom: 48px;
  margin-top: 0px;
`;

type NewsTitleProps = TitleProps & IBaseType;

export const NewsTitle: FC<NewsTitleProps> = ({ isLoading, ...props }) => {
  if (isLoading) {
    return (
      <Skeleton.Input
        active
        style={{ width: '100%', height: 50, marginBottom: 48 }}
      />
    );
  }
  return <StyledTitle level={1} {...props} />;
};

type NewsBodyProps = ParagraphProps & IBaseType;

export const NewsBody: FC<NewsBodyProps> = ({ isLoading, ...props }) => {
  if (isLoading) {
    return [1, 2, 3, 4].map((id) => (
      <Skeleton.Input
        active
        key={id}
        style={{ width: '100%', height: 20, marginBottom: 10 }}
      />
    ));
  }
  return <Typography.Paragraph {...props} />;
};

export const StyledLink = styled(Link)`
  color: ${({
    theme: {
      colors: {
        components: {
          colors: { gray600 },
        },
      },
    },
  }) => gray600};
  font-size: ${(props) => props.theme.fontSize.large};
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  text-decoration-line: underline;
`;

export const BackButtonContainer = styled(Stack)`
  margin-bottom: 32px;
`;

interface IBaseType {
  isLoading?: boolean;
}
interface BackButtonProps {
  isNews?: boolean;
}

export const BackButton: FC<BackButtonProps> = ({ isNews = true }) => {
  const to = useMemo(
    () =>
      isNews
        ? `${pagesMap.news}/${U.ALL_CATEGORIES_PARAM}`
        : `${pagesMap.resources}/${U.ALL_CATEGORIES_PARAM}`,
    [isNews]
  );

  const linkText = useMemo(
    () => (isNews ? `Back to News` : `Back to Resources`),
    [isNews]
  );

  return (
    <BackButtonContainer alignment="center">
      <ArrowLeft style={{ display: 'flex' }} height={14} width={14} />
      <StyledLink to={to}>{linkText}</StyledLink>
    </BackButtonContainer>
  );
};

export const AuthorLabel = styled(Title)`
  color: ${({
    theme: {
      colors: {
        components: {
          colors: { green700 },
        },
      },
    },
  }) => `${green700} !important`};
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  margin: 0 !important;
`;

export const AuthorValue = styled(Text)<{ $isDate?: boolean }>`
  color: ${({
    theme: {
      colors: {
        components: {
          colors: { gray900 },
        },
      },
    },
  }) => gray900};
  font-size: ${(props) => props.theme.fontSize.medium};
  font-style: normal;
  font-weight: ${({ $isDate }) => ($isDate ? 'normal' : '500')};
  line-height: 28px;
  text-decoration-line: ${({ $isDate }) => ($isDate ? 'none' : 'underline')};
`;

export const AuthorInfoContainer = styled(Flex)`
  margin-bottom: 24px;
`;

type AuthorInfoComponentProps = {
  fullName: string;
  lastUpdated?: string | null;
} & IBaseType;

export const AuthorInfoComponent: FC<AuthorInfoComponentProps> = ({
  lastUpdated,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <AuthorInfoContainer gap="0px 48px">
        <Skeleton.Input active style={{ width: 150, height: 60 }} />
        <Skeleton.Input active style={{ width: 150, height: 60 }} />
      </AuthorInfoContainer>
    );
  }
  return (
    <AuthorInfoContainer gap="0px 48px">
      {/* <Stack vertical>
        <AuthorLabel>Written by</AuthorLabel>
        <AuthorValue>{fullName}</AuthorValue>
      </Stack> */}
      {lastUpdated && (
        <Stack vertical spacing={'none'}>
          <AuthorLabel level={5}>Last updated</AuthorLabel>
          <AuthorValue type="secondary" $isDate>
            {lastUpdated}
          </AuthorValue>
        </Stack>
      )}
    </AuthorInfoContainer>
  );
};

export const StyledImages = styled.div`
  margin-bottom: 40px;
`;

type ImagesProps = {
  image?: ResourceDTO[] | null;
} & IBaseType;

const ImagesControl = styled(Button)`
  & * {
    display: flex;
    align-items: center;
  }
`;

export const Images: FC<ImagesProps> = ({ image: images, isLoading }) => {
  const ref = useRef(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const size = useSize(ref);
  if (isLoading) {
    return (
      <StyledImages>
        <Flex gap="32px">
          <Skeleton.Button
            block
            active
            style={{ width: '100%', height: 300 }}
          />
          <Skeleton.Button
            block
            active
            style={{ width: '100%', height: 300 }}
          />
        </Flex>
      </StyledImages>
    );
  }
  if (!isLoading && !images?.length) {
    return null;
  }
  return (
    <StyledImages ref={ref}>
      {images ? (
        <Swiper
          style={{
            maxWidth: size?.width,
            width: size?.width,
            height: 500,
            zIndex: 0,
          }}
          modules={[Navigation]}
          width={size?.width}
          spaceBetween={32}
          slidesPerView={2.5}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {images?.map(({ id }) => {
            return (
              <SwiperSlide key={id}>
                <Image
                  src={`${DIRECTUS_ASSETS_URL}${id}`}
                  style={{ maxHeight: '100%' }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : null}

      <Flex gap="22px" style={{ marginTop: 32 }}>
        <ImagesControl
          icon={<ArrowNarrowLeft height={24} width={24} />}
          onClick={() => swiperRef.current?.slidePrev()}
          size="large"
          shape="circle"
        />
        <ImagesControl
          icon={<ArrowNarrowRight height={24} width={24} />}
          onClick={() => swiperRef.current?.slideNext()}
          size="large"
          shape="circle"
        />
      </Flex>
    </StyledImages>
  );
};
