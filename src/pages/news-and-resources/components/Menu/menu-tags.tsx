import { SearchMd, Tag01 } from '@untitled-ui/icons-react';
import { useDebounce } from 'ahooks';
import { FC, useCallback, useMemo, useState } from 'react';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { MenuItem } from 'src/pages/news-and-resources/news.tsx';
import { NewsTagsDTO } from 'src/transport/news/news.dto.ts';
import * as S from './menu.styles.tsx';
import * as CS from '../../news-card-list.styled.tsx';
import { sortBy } from 'lodash';

const MenuTags: FC<{
  tags: NewsTagsDTO[] | null;
  selectedTags: number[];
  onChange: (tag: number, checked: boolean) => void;
}> = ({ tags, onChange, selectedTags }) => {
  const [seeAllTags, setSeeAllTags] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  const debouncedKeyword = useDebounce(keyword, { wait: 500 });

  const filteredTags = useMemo(() => {
    const shownTags = seeAllTags ? tags : tags?.slice(0, 5);
    if (!debouncedKeyword) return shownTags;
    return shownTags?.filter(({ label }) =>
      (label || '').toLowerCase().includes(debouncedKeyword.toLowerCase())
    );
  }, [debouncedKeyword, seeAllTags, tags]);

  const isTagChecked = useCallback(
    (tagId: number) => {
      return !!selectedTags?.find((_tagId) => _tagId === tagId);
    },
    [selectedTags]
  );

  if (!tags?.length) return null;

  const tagItems: MenuItem[] = [
    {
      key: 'tags',
      label: <Title level={5}>Tags</Title>,
      icon: <Tag01 />,
      children: [
        {
          key: 'search',
          icon: (
            <CS.StyledSearch
              prefix={<SearchMd width={20} height={20} />}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search tags"
              marginTop={24}
              allowClear
            />
          ),
        },
        ...sortBy(filteredTags || [], 'label').map(({ id, label: name }) => {
          return {
            key: id,
            label: name,
            icon: <S.StyledCheckbox checked={isTagChecked(id)} />,
            onClick: () => {
              onChange(id, !isTagChecked(id));
            },
          };
        }),
      ],
    },
  ];

  return (
    <>
      <S.MenuStyled
        mode="inline"
        defaultOpenKeys={['tags']}
        selectedKeys={[]}
        items={tagItems}
      />
      <S.SeeAllButton type="text" onClick={() => setSeeAllTags(!seeAllTags)}>
        {seeAllTags ? 'Show less tags' : 'See all tags'}
      </S.SeeAllButton>
    </>
  );
};

export default MenuTags;
