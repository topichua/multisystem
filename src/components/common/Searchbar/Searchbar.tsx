import { SearchSm } from '@untitled-ui/icons-react';
import { Input } from '../Input/Input';
import { InputProps } from 'antd';

export const SearchBar = (props: InputProps) => {
  return <Input allowClear prefix={<SearchSm />} {...props} />;
};
