import { useMemo } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import { Menu } from 'src/components/common/menu/menu';

import { Title } from 'src/components/common/Typography/Title';

import { useMemberContentStore } from '../members-content.provider';

export const MemberContentMenu = observer(() => {
  const navigate = useNavigate();

  const { isPagesLoading, pages } = useMemberContentStore();

  const menuItems = useMemo(() => {
    const items = [
      {
        key: 'pages',
        label: <Title level={5}>Pages</Title>,
        children: pages?.map(({ id, name }) => {
          return { key: `/pages/${id}`, label: name };
        }),
      },
    ];
    return items;
  }, [pages]);

  return (
    <Spin spinning={isPagesLoading}>
      <Menu
        mode="inline"
        defaultOpenKeys={['pages']}
        selectedKeys={[location?.pathname]}
        items={menuItems}
        onClick={(e) => {
          navigate(e?.key);
        }}
      />
    </Spin>
  );
});
