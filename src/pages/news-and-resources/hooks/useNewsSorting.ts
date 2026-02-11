import { SortOrder } from 'antd/es/table/interface';
import snakeCase from 'lodash/snakeCase';
import { Dispatch, SetStateAction, useCallback } from 'react';

import { GetItemsParams } from 'src/transport/news/news.dto';

import { SortField } from '../components/news-sorter';

export const useNewsSorting = (
  setRequestParams: Dispatch<SetStateAction<GetItemsParams>>,
  fields: string | undefined = '*.*, tags.news_tags_id.*'
) => {
  const handleSortChange = useCallback(
    (field: SortField | '', order: SortOrder) => {
      if (!field?.length) {
        return setRequestParams({
          page: 1,
          sort: ['-date_created'],
          meta: '*',
          fields,
        });
      }

      setRequestParams((oldValue) => ({
        ...oldValue,
        sort: [`${order === 'ascend' ? '' : '-'}${snakeCase(field)} `],
      }));
    },
    [fields, setRequestParams]
  );

  return { handleSortChange };
};
