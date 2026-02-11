import { BaseOptionType } from 'antd/es/select';

export type SearchResultType = 'community' | 'post' | 'tag';

export interface SearchResultItem {
  type: SearchResultType;
  value: string;
  label: React.ReactNode;
}

export type OptionsType = BaseOptionType & Partial<SearchResultItem>;
