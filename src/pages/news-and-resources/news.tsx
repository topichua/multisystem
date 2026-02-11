import { Save01, SearchMd } from '@untitled-ui/icons-react';
import { useDebounce } from 'ahooks';
import { Layout, MenuProps } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { Page } from 'src/components/common/page/page';
import { Title } from 'src/components/common/Typography/Title.tsx';
import NewsMenu from 'src/pages/news-and-resources/components/Menu/news-menu.tsx';
import MenuTags from './components/Menu/menu-tags';
import * as S from './news-card-list.styled.tsx';
import * as CS from './components/Menu/menu.styles.tsx';
import { useNewsStore } from './store/news.store';

export type MenuItem = Required<MenuProps>['items'][number];

export const NewsPage = observer(() => {
  const {
    getNewsCategories,
    newsCategories,
    isNewsCategoriesLoading,
    getNewsTags,
    handleTagsChange,
    selectedTags,
    newsTags,
    toggleIsOnlySaved,
    isOnlySaved,
    updateKeyword,
  } = useNewsStore();

  const [keyword, setKeyword] = useState<string>('');

  const debouncedKeyword = useDebounce(keyword, { wait: 500 });

  useEffect(() => {
    getNewsCategories();
    getNewsTags();
  }, []);

  useEffect(() => {
    updateKeyword(debouncedKeyword);
  }, [debouncedKeyword, updateKeyword]);

  const menuItems: MenuItem[] = [
    {
      key: 'saved-news',
      label: <Title level={5}>My News</Title>,
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
          placeholder="Search news"
          marginTop={20}
          allowClear
        />
        <Divider spacing="none" />
        <NewsMenu
          isNews
          isLoadingCategories={isNewsCategoriesLoading}
          categories={newsCategories}
        />
        <Divider spacing="none" />
        <MenuTags
          onChange={handleTagsChange}
          tags={newsTags}
          selectedTags={selectedTags}
        />
        <Divider spacing="none" />
        <S.MenuStyled
          mode="inline"
          defaultOpenKeys={['saved-news']}
          selectedKeys={[]}
          items={menuItems}
        />
      </Page.Sider>
      <Outlet />
    </Layout>
  );
});
