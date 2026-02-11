import { Progress } from 'antd';
import { InternalLink } from 'src/components/common/Link/Link.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import * as S from './side-block.styled.ts';

const CpdProgress = () => {
  return (
    <Stack vertical>
      <Title level={4}>CPD</Title>
      <S.CPDBlock wrap={false} alignment="center">
        <Progress
          showInfo={false}
          strokeColor="#2B7683"
          strokeWidth={12}
          size={72}
          type="circle"
          percent={(16 / 20) * 100}
        />
        <Stack>
          <Title level={5} fontWeight={600}>{`Career stage / Position`}</Title>
          <Stack vertical spacing="none">
            <Title level={5} fontWeight={800}>
              CPD progress
            </Title>
            <S.CPDInfoText level={5} fontWeight={800}>
              16/20 <span>hrs</span>
            </S.CPDInfoText>
          </Stack>
        </Stack>
      </S.CPDBlock>
      <InternalLink href={pagesMap.cpdPage}>
        <S.LinkText> Go to CPD</S.LinkText>{' '}
      </InternalLink>
    </Stack>
  );
};

export default CpdProgress;
