import { Image } from 'antd';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { imageList } from './consts.ts';
import * as S from './profile.styles.ts';

const Images = () => {
  const onDownload = (url: string) => {
    const filename = url.split('/').pop() + '';
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };

  return (
    <>
      <Title level={3}>Logos</Title>
      <S.ImageContainer alignment="leading">
        {imageList.map((item) => (
          <Stack alignment="center">
            <S.StyledCard>
              <Image
                key={item}
                src={item}
                width={280}
                height={180}
                style={{ padding: 16 }}
                preview={false}
              />
              <S.DownloadButton onClick={() => onDownload(item)}>
                Download
              </S.DownloadButton>
            </S.StyledCard>
          </Stack>
        ))}
      </S.ImageContainer>
    </>
  );
};

export default Images;
