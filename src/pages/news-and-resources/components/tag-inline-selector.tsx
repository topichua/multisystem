import { Grid01 } from '@untitled-ui/icons-react';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import { ALL_CATEGORIES_PARAM } from 'src/pages/news-and-resources/utils/utils.tsx';
import { NewsTagsDTO } from 'src/transport/news/news.dto.ts';
import * as S from './styled.tsx';

type TagInlineSelectorProps = {
  innerHeaderTitle: string | undefined;
  isNews?: boolean;
  selectedTags: number[];
  initTags: NewsTagsDTO[] | null;
  handleTagsChange: (tag: number, checked: boolean) => void;
};

export const TagInlineSelector: FC<TagInlineSelectorProps> = ({
  innerHeaderTitle,
  isNews,
  handleTagsChange,
  initTags,
  selectedTags,
}) => {
  const navigate = useNavigate();

  const tags = useMemo(() => {
    return (initTags ?? []).filter((tag) => selectedTags.includes(tag.id));
  }, [initTags, selectedTags]);

  const path = isNews ? pagesMap.news : pagesMap.resources;

  if (tags.length == 0 && !innerHeaderTitle) return null;

  return (
    <InnerPageHeader
      style={{ marginTop: '-1px', minHeight: 44, padding: '4px 24px 12px' }}
    >
      <Stack>
        {!!innerHeaderTitle && (
          <S.StyledTag>
            <Grid01 />
            {innerHeaderTitle}
            <S.StyledClose
              onClick={() => navigate(path + '/' + ALL_CATEGORIES_PARAM)}
            />
          </S.StyledTag>
        )}
        {tags.map((tag) => (
          <S.StyledTag key={tag.id}>
            <S.StyledTagIcon />
            {tag.label}
            <S.StyledClose onClick={() => handleTagsChange(tag.id, false)} />
          </S.StyledTag>
        ))}
      </Stack>
    </InnerPageHeader>
  );
};
