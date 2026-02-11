import ErrorImage from 'src/assets/error-back.png';
import { SearchLg } from '@untitled-ui/icons-react';
import { Typography, Image } from 'antd';
import * as S from './error-page.styled';
import { Stack } from 'src/components/common/Stack/Stack';
const { Title, Text } = Typography;

export const ErrorPage = () => {
  return (
    <S.ErrorPageStyled>
      <div className="left">
        <div className="content">
          <Stack alignment="center">
            <SearchLg />
            <Title level={1}>404 error</Title>
          </Stack>
          <Text>
            Sorry, the page you are looking for doesn't exist or <br />
            has been moved. Try searching our platform
          </Text>
        </div>
      </div>
      <div className="right">
        <Image
          src={ErrorImage}
          alt="OTA Connect"
          preview={false}
          height={'80vh'}
        />
      </div>
    </S.ErrorPageStyled>
  );
};
