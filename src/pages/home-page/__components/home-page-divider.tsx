import { Divider } from 'src/components/common/Divider/Divider.tsx';
import * as S from 'src/pages/home-page/home.page.styled.tsx';

const HomePageDivider = () => {
  return (
    <S.SectionWrapper style={{ width: '100%' }}>
      <Divider
        style={{
          margin: 0,
          borderBlockStartWidth: 3,
        }}
      />
    </S.SectionWrapper>
  );
};

export default HomePageDivider;
