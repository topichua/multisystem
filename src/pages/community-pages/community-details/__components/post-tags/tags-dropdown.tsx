import { Plus } from '@untitled-ui/icons-react';
import { Button, Card, Dropdown, Empty, Select, Spin } from 'antd';

type TagsDropdownProps = {
  options: { label: string; value: string }[];
  values: string[];
  isLoading?: boolean;
  onChange: (values: string[]) => void;
};

export const TagsDropdown = ({
  options,
  values,
  isLoading,
  onChange,
}: TagsDropdownProps) => {
  return (
    <Dropdown
      destroyPopupOnHide
      dropdownRender={() => (
        <>
          <Card size="small" title="Search tags" style={{ marginTop: 8 }}>
            <Select
              mode="multiple"
              loading={isLoading}
              optionFilterProp="label"
              showSearch
              notFoundContent={
                isLoading ? (
                  <Spin size="small" />
                ) : (
                  <Empty
                    description="No data"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }
              options={options}
              style={{ width: 300 }}
              value={values}
              maxCount={10}
              onChange={onChange}
            />
          </Card>
        </>
      )}
      trigger={['click']}
    >
      <Button
        icon={<Plus height={20} width={20} />}
        shape="round"
        type="text"
        style={{ display: 'inline-flex', paddingInlineStart: 8 }}
      >
        Add tag
      </Button>
    </Dropdown>
  );
};
