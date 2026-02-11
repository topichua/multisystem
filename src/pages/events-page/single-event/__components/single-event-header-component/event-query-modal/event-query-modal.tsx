import { useBoolean } from 'ahooks';
import { Form, notification } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { Button } from 'src/components/common/Button/Button.tsx';
import { InputTextArea } from 'src/components/common/Input/Input.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { eventsApi } from 'src/transport/events/events.api.ts';
import * as S from './event-query-modal.styled.ts';

interface EventQueryModalProps {
  isOpen: boolean;
  eventId: string;
  onClose: () => void;
}

export const EventQueryModal = ({
  eventId,
  onClose,
  isOpen,
}: EventQueryModalProps) => {
  const [form] = Form.useForm();
  const queryDetails = useWatch('queryDetails', form);
  const [
    isQuerySending,
    { setTrue: startQuerySending, setFalse: stopQuerySending },
  ] = useBoolean(false);

  const handleFormSubmit = () => {
    startQuerySending();
    eventsApi
      .sendEventQuery({ eventId, queryDetails })
      .then(({ message }) => {
        notification.success({
          message: message,
        });
        onClose();
        form.resetFields();
      })
      .catch(() => {
        notification.error({
          message: 'Failed to submit query',
        });
      })
      .finally(stopQuerySending);
  };

  return (
    <S.StyledModal
      centered
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
      footer={
        <Stack distribution="center">
          <Button
            type="primary"
            onClick={handleFormSubmit}
            loading={isQuerySending}
            disabled={!queryDetails}
          >
            Submit a query
          </Button>
        </Stack>
      }
    >
      <Form layout="vertical" form={form} validateTrigger={'onSubmit'}>
        <Form.Item label=" " name="queryDetails">
          <InputTextArea placeholder="Leave us a query..." rows={5} />
        </Form.Item>
      </Form>
    </S.StyledModal>
  );
};
