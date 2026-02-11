import { Form, ModalProps, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { CommunityQuestion } from 'src/transport/communities/communities.dto';

export type QuestionValues = {
  id?: string;
  text?: string;
  isRequiredAssets?: boolean;
};

export type QuestionDtoValues = {
  id?: string;
  text: string;
  isRequiredAssets: boolean;
};

type AddQuestionModalProps = ModalProps & {
  question?: Partial<CommunityQuestion>;
  onMutateQuestion: (question: QuestionDtoValues) => void;
};

export const AddQuestionModal = ({
  question,
  onMutateQuestion,
  ...rest
}: AddQuestionModalProps) => {
  const [form] = useForm();

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    onMutateQuestion({
      text: values.text,
      isRequiredAssets: values.isRequiredAssets,
      id: values.id || undefined,
    });
  };

  const isEditMode = !!question?.id;

  return (
    <Modal
      title={`${isEditMode ? 'Edit' : 'Add'} question`}
      style={{ top: 20 }}
      okText={isEditMode ? 'Edit' : 'Add'}
      onOk={form.submit}
      destroyOnClose
      {...rest}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          id: question?.id || null,
          text: question?.text || '',
          isRequiredAssets: question?.isRequiredAssets || false,
        }}
        clearOnDestroy
        onFinish={handleSubmit}
      >
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="text"
          label="Question text"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter a question',
            },
          ]}
        >
          <Input maxLength={150} placeholder="Title" required />
        </Form.Item>

        <Form.Item name="isRequiredAssets" label="Is a file required?">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
