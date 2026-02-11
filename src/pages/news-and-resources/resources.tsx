import { Save01, SearchMd } from '@untitled-ui/icons-react';
import { useDebounce } from 'ahooks';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { Page } from 'src/components/common/page/page.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import MenuTags from 'src/pages/news-and-resources/components/Menu/menu-tags.tsx';
import NewsMenu from 'src/pages/news-and-resources/components/Menu/news-menu.tsx';
import { MenuItem } from 'src/pages/news-and-resources/news.tsx';
import {
  useResourceCategoryStore,
  useResourceTagStore,
} from './store/resources.store';
import * as S from './news-card-list.styled.tsx';
import * as CS from './components/Menu/menu.styles.tsx';

export const ResourcesPage = observer(() => {
  const {
    getCategories,
    categories,
    isLoading,
    toggleIsOnlySaved,
    isOnlySaved,
    updateKeyword,
  } = useResourceCategoryStore();
  const { selectedTags, tags, handleTagsChange, getTags } =
    useResourceTagStore();

  const [keyword, setKeyword] = useState<string>('');

  const debouncedKeyword = useDebounce(keyword, { wait: 500 });

  useEffect(() => {
    getCategories();
    getTags();
  }, []);

  useEffect(() => {
    updateKeyword(debouncedKeyword);
  }, [debouncedKeyword, updateKeyword]);

  const menuItems: MenuItem[] = [
    {
      key: 'saved-resources',
      label: <Title level={5}>My Resources</Title>,
      icon: <Save01 />,
      onClick: toggleIsOnlySaved,
      children: [
        {
          key: `bookmarked`,
          label: 'Bookmarked',
          icon: <CS.StyledRadio checked={isOnlySaved} />,
        },
      ],
    },
  ];

  return (
    <Layout>
      <Page.Sider fixed>
        <S.StyledSearch
          prefix={<SearchMd width={20} height={20} />}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search resources"
          marginTop={20}
          allowClear
        />
        <Divider spacing="none" />
        <NewsMenu isLoadingCategories={isLoading} categories={categories} />
        <Divider spacing="none" />
        <MenuTags
          onChange={handleTagsChange}
          tags={tags}
          selectedTags={selectedTags}
        />
        <Divider spacing="none" />
        <S.MenuStyled
          mode="inline"
          defaultOpenKeys={['saved-resources']}
          selectedKeys={[]}
          items={menuItems}
        />
      </Page.Sider>
      <Outlet />
    </Layout>
  );
});
