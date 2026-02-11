import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { Navigate } from 'react-router-dom';

import { useMemberContentStore } from './members-content.provider';

import * as S from './member-content.styled';

export const MemberContent = observer(() => {
  const { isPagesLoading, pages } = useMemberContentStore();

  if (!isPagesLoading && pages.length > 0) {
    return <Navigate to={`/pages/${pages[0].id}`} replace />;
  }

  return (
    <S.Wrapper>
      <Spin spinning={isPagesLoading} />
    </S.Wrapper>
  );
});
