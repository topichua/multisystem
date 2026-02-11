import { Grid01 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import { MenuItem } from 'src/pages/news-and-resources/news.tsx';
import {
  ALL_CATEGORIES_PARAM,
  skeletonItems,
} from 'src/pages/news-and-resources/utils/utils.tsx';
import { NewsCategoryDTO } from 'src/transport/news/news.dto.ts';
import * as S from './menu.styles.tsx';
import * as CS from '../../news-card-list.styled.tsx';
import { sortBy } from 'lodash';

type NewsMenuProps = {
  isLoadingCategories: boolean;
  isNews?: boolean;
  categories: NewsCategoryDTO[] | null;
};

const NewsMenu = observer(
  ({ categories, isLoadingCategories, isNews }: NewsMenuProps) => {
    const navigate = useNavigate();
    const path = isNews ? pagesMap.news : pagesMap.resources;

    const menuItems: MenuItem[] = [
      {
        key: 'categories',
        label: <Title level={5}>{isNews ? 'News' : 'Resource'} library</Title>,
        icon: <Grid01 />,
        children: isLoadingCategories
          ? skeletonItems
          : sortBy(categories || [], 'label').map(({ id, label: name }) => {
              return {
                key: `${path}/${id}`,
                label: name,
                icon: (
                  <S.StyledRadio
                    checked={location?.pathname === path + '/' + id}
                  />
                ),
              };
            }),
      },
    ];

    return (
      <CS.MenuStyled
        mode="inline"
        defaultOpenKeys={['categories']}
        selectedKeys={[location?.pathname]}
        items={menuItems}
        onClick={(e) => {
          if (location?.pathname === e?.key) {
            navigate(path + '/' + ALL_CATEGORIES_PARAM);
          } else {
            navigate(e?.key);
          }
        }}
      />
    );
  }
);

export default NewsMenu;
