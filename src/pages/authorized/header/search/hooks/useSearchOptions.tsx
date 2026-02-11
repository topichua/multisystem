import compact from 'lodash/compact';
import { useMemo } from 'react';

import { SearchResponse } from 'src/transport/search/search.dto';

import * as R from '../autocomplete-items';
import { SearchResultItem, SearchResultType } from '../types';

export const useSearchOptions = (data: SearchResponse | undefined) => {
  return useMemo(() => {
    if (!data) return [];
    const { communities, posts, tags } = data;

    const createOptions = <T,>(
      items: T[],
      renderItem: (item: T) => { value: string; label: React.ReactNode },
      type: SearchResultType
    ): SearchResultItem[] =>
      items.map((item) => ({
        ...renderItem(item),
        type,
      }));

    return compact([
      communities?.length && {
        label: 'Communities',
        options: createOptions(communities, R.renderCommunityItem, 'community'),
      },
      posts?.length && {
        label: 'Posts',
        options: createOptions(posts, R.renderPostItem, 'post'),
      },
      tags?.length && {
        label: 'Tags',
        options: createOptions(tags, R.renderTagItem, 'tag'),
      },
    ]);
  }, [data]);
};
