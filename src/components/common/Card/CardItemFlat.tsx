import { File02, File06, Play, Recording02 } from '@untitled-ui/icons-react';
import { Spin, Tooltip, Typography } from 'antd';
import { FC, ImgHTMLAttributes, ReactNode, useState } from 'react';

import NoImageAvailable from 'src/assets/no-image-available.jpg';

import { Stack } from '../Stack/Stack';

import { noop } from 'lodash';
import { ResponsiveTagList } from 'src/pages/news-and-resources/components/responsive-tag-list';
import * as S from './CardItemFlat.styled';

const { Paragraph } = Typography;

const iconMapping: Record<string, ReactNode> = {
  Video: <Play color="white" />,
  Audio: <Recording02 color="white" />,
  PDF: <File06 color="white" />,
  Article: <File02 color="white" />,
};

const Image: FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setLoading(false);
    setIsError(true);
  };

  return (
    <>
      {isError && !isLoading && <S.CoverImage src={NoImageAvailable} />}
      {!isError && isLoading && (
        <Spin spinning={isLoading} size="large">
          <S.CoverImage />
        </Spin>
      )}
      <S.CoverImage
        style={{
          display: isError || isLoading ? 'none' : 'initial',
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};

type CardItemFlatProps = {
  imageSrc?: string;
  imageAlt: string;
  additionalInformation?: string;
  smallIcon?: string;
  title: string;
  description: string;
  onClick?: () => void;
  tags?: string[];
  author?: string;
  children?: React.ReactNode;
  bookmark?: ReactNode;
};

//Children will be used as extension point, Price or Tags can be passed - A.H -FYI
export const CardItemFlat: FC<CardItemFlatProps> = ({
  imageSrc,
  imageAlt,
  smallIcon,
  title,
  description,
  additionalInformation,
  tags,
  author,
  onClick = noop,
  children,
  bookmark,
}) => {
  return (
    <S.Card
      hoverable={true}
      onClick={onClick}
      cover={
        <Stack style={{ position: 'relative' }}>
          <Stack distribution="center">
            <Image alt={imageAlt} src={imageSrc} />
          </Stack>
          {smallIcon && (
            <S.Wrapper>
              <Tooltip title={smallIcon}>{iconMapping[smallIcon]}</Tooltip>
            </S.Wrapper>
          )}
        </Stack>
      }
    >
      <Stack vertical>
        <Stack distribution="equalSpacing" wrap={false}>
          <Tooltip title={title}>
            <S.Title ellipsis={{ rows: 2, expandable: false }}>{title}</S.Title>
          </Tooltip>
          {bookmark}
        </Stack>
        {description && (
          <Paragraph ellipsis={{ rows: 2, expandable: false }}>
            {description}
          </Paragraph>
        )}
        {tags?.length && <ResponsiveTagList tags={tags} />}
        {additionalInformation && (
          <S.AdditionalInformation ellipsis={{ rows: 3 }}>
            {additionalInformation}
          </S.AdditionalInformation>
        )}
        {author && <S.Author>{author}</S.Author>}
      </Stack>
      {children && <Stack>{children}</Stack>}
    </S.Card>
  );
};
