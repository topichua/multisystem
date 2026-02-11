import { useEffect } from 'react';
import { Upload01 } from '@untitled-ui/icons-react';
import { Form, Input, ModalProps, Upload, UploadFile } from 'antd';
import styled from 'styled-components';
import { useForm } from 'antd/es/form/Form';

import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';
import { InputPassword } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { Title } from 'src/components/common/Typography/Title';
import { CommunityQuestion } from 'src/transport/communities/communities.dto';

const StyledModal = styled(Modal)`
  .ant-modal-header {
    margin-bottom: 24px;
  }
`;

export type JoinQuestionsFormValues = {
  questions: Array<{
    questionId: string;
    answer: string;
    file: UploadFile[];
  }>;
};

type QuestionsModalProps = ModalProps & {
  questions: CommunityQuestion[];
  onJoin: (values: JoinQuestionsFormValues) => void;
};

export const QuestionsModal = ({
  questions,
  open,
  onJoin,
  ...rest
}: QuestionsModalProps) => {
  const [form] = useForm();

  useEffect(() => {
    if (open) {
      const initialValues = {
        questions: questions.map((question) => ({
          answer: '',
          file: [],
          questionId: question.id,
        })),
      };
      form.setFieldsValue(initialValues);
    }
  }, [questions, form, open]);

  const handleJoinCommunity = () => {
    const values: JoinQuestionsFormValues = form.getFieldsValue();
    onJoin(values);
  };

  return (
    <StyledModal
      open={open}
      title="Join questions"
      okText="Request to join"
      style={{ top: 20 }}
      onOk={form.submit}
      destroyOnClose
      {...rest}
    >
      <Form
        form={form}
        layout="vertical"
        clearOnDestroy
        onFinish={handleJoinCommunity}
      >
        <Form.List name="questions">
          {(fields) =>
            fields.map((field, index) => {
              const question = questions[index];
              return (
                <div key={field.key}>
                  <Form.Item hidden name={[field.name, 'questionId']}>
                    <InputPassword />
                  </Form.Item>

                  <Form.Item
                    label={<Title level={5}>{question.text}</Title>}
                    name={[field.name, 'answer']}
                    rules={[
                      {
                        required: !question.isRequiredAssets,
                        whitespace: !question.isRequiredAssets,
                        message: 'This field is required',
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Write your answer here" />
                  </Form.Item>

                  {question.isRequiredAssets && (
                    <Form.Item
                      name={[field.name, 'file']}
                      label="Upload File"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        const fileList = Array.isArray(e) ? e : e?.fileList;
                        return fileList?.slice(-1);
                      }}
                      rules={[
                        {
                          required: true,
                          message: 'Please upload a file.',
                        },
                      ]}
                    >
                      <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<Upload01 />}>Upload File</Button>
                      </Upload>
                    </Form.Item>
                  )}

                  <Divider />
                </div>
              );
            })
          }
        </Form.List>
      </Form>
    </StyledModal>
  );
};
