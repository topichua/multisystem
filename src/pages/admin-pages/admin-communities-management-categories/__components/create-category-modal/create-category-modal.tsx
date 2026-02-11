import { ColorPicker, Form } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';
import { useEffect } from 'react';

import { Divider } from 'src/components/common/Divider/Divider';
import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';
import { useCategorizationModal } from '../../__hooks/useCategorizationModal';

export type CategoryFormValues = {
  id?: string;
  name: string;
  description: string;
  color: AggregationColor;
  parentCategoryId?: string | null;
};

type CreateCategoryModalProps = {
  isOpen: boolean;
  category: Partial<CommunitiyCategoryDto> | null;
  isLoading?: boolean;
  onClose: () => void;
  onCreateOrUpdate: (data: CategoryFormValues) => void;
};

export const CreateCategoryModal = ({
  isOpen,
  category,
  isLoading = false,
  onCreateOrUpdate,
  onClose,
}: CreateCategoryModalProps) => {
  const [form] = Form.useForm<CategoryFormValues>();

  useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [isOpen]);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        id: category.id || undefined,
        name: category.name || '',
        description: category.description || '',
        color: new AggregationColor(category.color || '#344054'),
      });
    }
  }, [category]);

  useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [isOpen]);

  const { modalProps } = useCategorizationModal({
    form,
    isLoading,
    isOpen,
    onClose,
    category,
  });

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    if (category?.parentCategoryId) {
      values.parentCategoryId = category?.parentCategoryId;
    }

    onCreateOrUpdate({
      ...values,
      id: category?.id ?? undefined,
    });
  };

  return (
    <Modal {...modalProps}>
      <Form
        form={form}
        initialValues={{
          id: category?.id || undefined,
          name: category?.name || '',
          description: category?.description,
          color: new AggregationColor(category?.color || '#344054'),
        }}
        requiredMark={false}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Divider />
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Type title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="Type description" />
        </Form.Item>
        <Form.Item name="color" label="Color">
          <ColorPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};
