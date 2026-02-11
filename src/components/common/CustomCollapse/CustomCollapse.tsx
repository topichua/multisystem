import { FC } from 'react';
import { CollapseProps } from 'antd';
import { StyledCollapse } from './CustomCollapse.styled';
import { ChevronUp } from '@untitled-ui/icons-react';

export const CustomCollapse: FC<CollapseProps> = (props) => (
  <StyledCollapse
    bordered={false}
    expandIconPosition="end"
    expandIcon={({ isActive }) => (
      <ChevronUp
        width={24}
        height={24}
        style={{
          ...(!isActive && {
            transform: 'rotate(180deg)',
          }),
          color: isActive ? '#005B6A' : '#98A2B3',
        }}
      />
    )}
    {...props}
  />
);
