import { AlertCircle, CurrencyDollar, Hash02 } from '@untitled-ui/icons-react';
import { ModalProps, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';
import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import { Ticket } from 'src/transport/events/events.dto';
import { formatPrice } from 'src/utils/text';

const { Text } = Typography;

const iconSize = {
  height: 12,
  width: 12,
};

type EventTicketListModalProps = ModalProps & {
  tickets: Ticket[];
  onCancelRegistration: (ticket: Ticket) => void;
};

export const EventTicketListModal = ({
  tickets,
  onCancelRegistration,
  ...rest
}: EventTicketListModalProps) => {
  return (
    <Modal {...rest} footer={null} title="Tickets" style={{ top: 20 }}>
      {tickets.map((ticket) => (
        <>
          <Stack alignment="center">
            <Stack.Item fill>
              <Stack vertical spacing="tight">
                <Text type="secondary">
                  <CurrencyDollar {...iconSize} />{' '}
                  {formatPrice(ticket.ticketPrice)}
                </Text>
                <Text type="secondary">
                  <Hash02 {...iconSize} /> ticket number - {ticket.ticketNumber}
                </Text>
                <Text type="secondary" title="Status">
                  <AlertCircle {...iconSize} />{' '}
                  {ticket?.attendanceStatus || 'Active'}
                </Text>
              </Stack>
            </Stack.Item>

            <Button onClick={() => onCancelRegistration(ticket)}>
              Cancel Registration
            </Button>
          </Stack>

          <Divider spacing="normal" />
        </>
      ))}
    </Modal>
  );
};
