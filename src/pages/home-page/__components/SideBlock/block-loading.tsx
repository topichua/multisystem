import { Skeleton } from 'antd';
import { CalendarLoader } from 'src/pages/home-page/__components/SideBlock/side-block.styled.ts';
import * as S from './side-block.styled.ts';

const BlockLoading = () => {
  return (
    <S.Loading>
      {[1, 2, 3].map((item) => (
        <S.LoadingStack key={item} wrap={false}>
          <CalendarLoader active />
          <Skeleton.Input active size="large" block />
        </S.LoadingStack>
      ))}
    </S.Loading>
  );
};

export default BlockLoading;
