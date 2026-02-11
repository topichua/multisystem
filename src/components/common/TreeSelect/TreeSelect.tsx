import { TreeSelect as AntdTreeSelect, TreeSelectProps } from 'antd';
import './TreeSelect.styles.css';

export const TreeSelect = (props: TreeSelectProps) => (
  <AntdTreeSelect {...props} />
);
