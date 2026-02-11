import axios from 'src/transport/axios/axios-instance';
import { SearchResponse } from './search.dto';

export const searchApi = {
  search(keyword: string): Promise<SearchResponse> {
    return axios.post(`api/v1/community/global-search`, undefined, {
      params: {
        Keyword: keyword,
      },
    });
  },
};
