import { ModalProps, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button';
import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';

const { Text } = Typography;

type CancelTicketModalProps = ModalProps & {
  onCancelTicket: () => void;
  onNominateTicket: () => void;
};

export const CancelTicketModal = ({
  onCancelTicket,
  onNominateTicket,
  ...rest
}: CancelTicketModalProps) => {
  return (
    <Modal
      {...rest}
      style={{ top: 20 }}
      title="Cancel registration"
      footer={
        <Stack>
          <Stack.Item fill>
            <Button block onClick={onNominateTicket}>
              Nominate Substitute
            </Button>
          </Stack.Item>
          <Stack.Item fill>
            <Button danger block onClick={onCancelTicket}>
              Request Refund
            </Button>
          </Stack.Item>
        </Stack>
      }
    >
      <Stack vertical spacing="normal">
        <Title level={5}>
          Association Continued Professional Development (CPD) Events
        </Title>
        <Text italic>
          Should you be unable to attend an Association event for which you have
          registered and paid, a substitute delegate is welcome to attend in
          your place, so long as the Association has been notified in writing
          and in advance of the event. If the substitute attendee is not a
          member, the non-member fee will apply and extra payment will be due
          and payable before the event date. All registrants for any OTA event
          must have paid their event registration fees in full prior to
          attending an event or risk non-admission.
        </Text>
        <Text italic>
          If you cancel your registration for an event, a refund equivalent to
          90% of the registration fee paid will be given, provided a written
          cancellation is received by the Association no later than{' '}
          <Text strong>14</Text> days prior to the event. Cancellation after
          this time will be ineligible for a refund. In unavoidable
          circumstances, where there has been an accident, injury or death,
          please contact OTA directly.
        </Text>
        <Text italic>
          Refunds will not be provided to registrants who do not cancel or do
          not attend an event. Registrants who do not attend their enrolled
          event will be ineligible to receive event information, including but
          not limited to notes, workbooks and slides. This includes due to
          transport delays (flights, road and rail).
        </Text>
        <Text italic>
          Please note that OTA frequently run waiting lists for their courses.
          If you have been delayed through transport issues please contact the
          OTA rep on the course correspondence you have received ASAP. A
          substitute may be able to be arranged. No partial refunds will be
          offered if the substitute registrant is eligible for a cheaper ticket
          price.
        </Text>
        <Title level={5}>Association Conferences</Title>
        <Text italic>
          Registration cancellations received in writing to Occupational Therapy
          Australia 30 days prior to the Conference will receive a refund less a
          handling fee of $110 including GST. No refund will be given after this
          date; however, an alternative delegate name may be submitted. All
          cancellations and substitutions must be made by email. Additional
          Terms and Conditions may be applicable to each individual conference
          and are accessible via the conference website.
        </Text>
      </Stack>
    </Modal>
  );
};
