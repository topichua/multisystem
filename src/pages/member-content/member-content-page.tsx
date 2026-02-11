import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useBoolean } from 'ahooks';
import { Spin } from 'antd';

import * as S from './member-content.styled';

export const MemberContentPage = observer(() => {
  let { id } = useParams();

  const [key, setKey] = useState(id);
  const [isLoading, { setFalse: finishLoading, setTrue: startLoading }] =
    useBoolean(true);

  useEffect(() => {
    setKey(id);
    startLoading();
  }, [id]);

  return (
    <Spin spinning={isLoading} size="large">
      <S.IFrameWrapper>
        <iframe
          key={key}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          src={`https://ota-website-beta.azurewebsites.net/api/draft?secret=0LdcOM6a8E&hideLayout=true&model=page&id=${id}`}
          onLoad={finishLoading}
        />
      </S.IFrameWrapper>
    </Spin>
  );
});
