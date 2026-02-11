// import { ArrowDown, ArrowUp } from '@untitled-ui/icons-react';
import { Select } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useCallback } from 'react';
import { NewsDTO } from 'src/transport/news/news.dto';

const { Option } = Select;

type SortableNewsFields = Pick<
  NewsDTO,
  'dateCreated' | 'dateUpdated' | 'name' | 'status'
>;

export type SortField = keyof SortableNewsFields;

interface SortOption {
  label: string;
  value: SortField;
  sortOrder: SortOrder;
}

const sortOptions: SortOption[] = [
  { label: 'Oldest First', value: 'dateCreated', sortOrder: 'ascend' },
  { label: 'Newest First', value: 'dateCreated', sortOrder: 'descend' },
  { label: 'Oldest Update', value: 'dateUpdated', sortOrder: 'ascend' },
  { label: 'Most Recent Update', value: 'dateUpdated', sortOrder: 'descend' },
  { label: 'Name (A-Z)', value: 'name', sortOrder: 'ascend' },
  { label: 'Name (Z-A)', value: 'name', sortOrder: 'descend' },
];

interface NewsSorterProps {
  onSortChange: (field: SortField | '', order: SortOrder) => void;
}

export const NewsSorter: React.FC<NewsSorterProps> = ({ onSortChange }) => {
  const handleChange = useCallback(
    (value: string) => {
      if (value === '') {
        onSortChange('' as SortField, null);
      } else {
        const selectedOption = sortOptions.find(
          (option) => `${option.value}-${option.sortOrder}` === value
        );
        if (selectedOption) {
          onSortChange(selectedOption.value, selectedOption.sortOrder);
        }
      }
    },
    [onSortChange]
  );

  return (
    <Select
      style={{ width: 180, height: 32 }}
      placeholder="Sort by"
      onChange={handleChange}
      suffixIcon={null}
      defaultValue="dateCreated-descend"
    >
      {sortOptions.map((option) => (
        <Option
          key={`${option.value}-${option.sortOrder}`}
          value={`${option.value}-${option.sortOrder}`}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{option.label}</span>
            {/* {option.sortOrder === 'ascend' ? (
              <ArrowUp height={16} width={16} />
            ) : (
              <ArrowDown height={16} width={16} />
            )} */}
          </div>
        </Option>
      ))}
    </Select>
  );
};
