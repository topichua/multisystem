import { Form } from 'antd';
import { useEffect } from 'react';

import { Divider } from 'src/components/common/Divider/Divider';
import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { PostTag } from 'src/transport/communities/communities.dto';

export type TagFormValues = {
  id?: string;
  name: string;
};

type CreateTagModalProps = {
  isOpen: boolean;
  tag?: Partial<PostTag> | null; // TODO: change type
  isLoading?: boolean;
  onClose: () => void;
  onCreateOrUpdate: (data: TagFormValues) => void;
};

export const CreateTagModal = ({
  isOpen,
  tag,
  isLoading = false,
  onClose,
  onCreateOrUpdate,
}: CreateTagModalProps) => {
  const isEditMode = !!tag?.id;

  const [form] = Form.useForm<TagFormValues>();

  useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [isOpen]);

  useEffect(() => {
    if (tag) {
      form.setFieldsValue({
        id: tag.id || undefined,
        name: tag.name || '',
      });
    }
  }, [tag]);

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    onCreateOrUpdate(values);
  };

  return (
    <Modal
      title={`${isEditMode ? 'Edit' : 'Create'} tag`}
      open={isOpen}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      destroyOnClose
      okText={isEditMode ? 'Save' : 'Create'}
      onOk={form.submit}
      onCancel={onClose}
    >
      <Form
        form={form}
        initialValues={{
          id: tag?.id || undefined,
          name: tag?.name || '',
        }}
        requiredMark={false}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Divider />
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a tag name' }]}
        >
          <Input placeholder="Type tag name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
