import { Form, ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';

export type NominateTicketValues = {
  nomineeTitle: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineeMobile: string;
  nomineeOrgName: string;
};

type NominateTicketModalProps = ModalProps & {
  isLoading?: boolean;
  onNominateTicket: (values: NominateTicketValues) => void;
};

export const NominateTicketModal = ({
  isLoading = false,
  onNominateTicket,
  ...rest
}: NominateTicketModalProps) => {
  const [form] = useForm<NominateTicketValues>();

  const handleSubmit = (values: NominateTicketValues) => {
    onNominateTicket(values);
  };

  return (
    <Modal
      {...rest}
      style={{ top: 20 }}
      destroyOnClose
      title="Nominate Substitute"
      okText="Send"
      cancelButtonProps={{ disabled: isLoading }}
      okButtonProps={{ danger: true, loading: isLoading, disabled: isLoading }}
      onOk={form.submit}
    >
      <Form
        form={form}
        requiredMark={false}
        layout="vertical"
        initialValues={{
          nomineeTitle: '',
          nomineeName: '',
          nomineeEmail: '',
          nomineeMobile: '',
          nomineeOrgName: '',
        }}
        clearOnDestroy
        onFinish={handleSubmit}
      >
        <Form.Item
          name="nomineeTitle"
          label="Nominee title"
          rules={[
            { required: true, message: 'Please enter a nominee title' },
            { max: 150, message: 'Max length is 150 symbols' },
          ]}
        >
          <Input maxLength={150} placeholder="Title" required />
        </Form.Item>
        <Form.Item
          name="nomineeName"
          label="Nominee name"
          rules={[
            { required: true, message: 'Please enter a nominee name' },
            { max: 150, message: 'Max length is 150 symbols' },
          ]}
        >
          <Input maxLength={150} placeholder="Name" required />
        </Form.Item>
        <Form.Item
          name="nomineeEmail"
          label="Nominee email"
          rules={[
            { required: true, message: 'Please enter a nominee email' },
            { type: 'email', message: 'Enter valid email' },
          ]}
        >
          <Input maxLength={150} placeholder="Email" required />
        </Form.Item>
        <Form.Item
          name="nomineeMobile"
          label="Nominee mobile"
          rules={[
            {
              required: true,
              message: 'Please enter a nominee mobile',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Enter a valid mobile number (numbers only)',
            },
          ]}
        >
          <Input
            maxLength={15}
            placeholder="Mobile"
            inputMode="numeric"
            required
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value.replace(/[^0-9]/g, '');
              form.setFieldsValue({ nomineeMobile: numericValue });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
