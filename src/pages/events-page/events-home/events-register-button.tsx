import { FC, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Button } from 'src/components/common/Button/Button';
import { Ticket01 } from '@untitled-ui/icons-react';
import { EventResponse, Ticket } from 'src/transport/events/events.dto';
import { eventsApi } from 'src/transport/events/events.api';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { useEventAction } from './__hooks/useEventAction';
import {
  NominateTicketModal,
  NominateTicketValues,
} from './__components/nominate-ticket-modal/nominate-ticket-modal';
import {
  EventDietaryModal,
  EventDietaryValue,
} from './__components/event-dietary-modal/event-dietary-modal';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { CancelTicketModal } from './__components/cancel-ticket-modal/cancel-ticket-modal';

type EventsRegisterButtonProps = {
  event: EventResponse;
  refetchUserEvents: () => Promise<void>;
};
const EventsRegisterButton: FC<EventsRegisterButtonProps> = ({
  event,
  refetchUserEvents,
}) => {
  const { user: currentUser } = useCurrentUserStore();
  const {
    isCancelTicketLoading,
    isNominateTicketLoading,
    isChangeTicketLoading,
    nominateTicket: onNominateTicket,
    cancelTicket: onCancelTicket,
    registerToEvent: onRegisterToEvent,
    changeTicketDietary: onChangeTicketDietary,
  } = useEventAction();

  const [
    selectedTicketToCancelRegistration,
    setSelectedTicketToCancelRegistration,
  ] = useState<Ticket | null>(null);

  const [selectedTicketForCancel, setSelectedTicketForCancel] =
    useState<Ticket | null>(null);
  const [selectedTicketForNominate, setSelectedTicketForNominate] =
    useState<Ticket | null>(null);
  const [selectedTicketForDietary, setSelectedTicketForDietary] =
    useState<Ticket | null>(null);

  const [registerEvent, setRegisterEvent] = useState<EventResponse | null>(
    null
  );

  const [isRegLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const refetch = () => {
    if (typeof refetchUserEvents === 'function') {
      refetchUserEvents();
    }
  };

  const checkIsFreeEvent = () => {
    eventsApi.getTicket(event.id).then(({ data }) => {
      const ticket = data.find(
        (ticket) => ticket.ticketPriceId === event.singleClickTicketPriceId
      );
      if (ticket && ticket.amount === 0) {
        registerToEvent(event);
      } else {
        setRegisterEvent(event);
      }
    });
  };

  const registerToEvent = (registerEvent: EventResponse) => {
    if (registerEvent?.singleClickTicketPriceId && currentUser) {
      onRegisterToEvent(
        registerEvent.singleClickTicketPriceId,
        currentUser.id
      ).then(() => {
        refetch();
        setRegisterEvent(null);
        finishLoading();
      });
    }
  };

  const cancelTicket = () => {
    if (selectedTicketForCancel) {
      onCancelTicket(selectedTicketForCancel.ticketId).then((isSuccess) => {
        if (!isSuccess) return;

        refetch();
        setSelectedTicketForCancel(null);
        setSelectedTicketToCancelRegistration(null);
      });
    }
  };

  const nominateTicket = (data: NominateTicketValues) => {
    if (selectedTicketForNominate) {
      onNominateTicket({
        ticketId: selectedTicketForNominate.ticketId,
        ...data,
      }).then((isSuccess) => {
        if (!isSuccess) return;

        refetch();
        setSelectedTicketForNominate(null);
        setSelectedTicketToCancelRegistration(null);
      });
    }
  };

  const changeTicketDietary = (data: EventDietaryValue) => {
    onChangeTicketDietary({
      ...data,
      ticketId: selectedTicketForDietary?.ticketId as string,
    }).then(() => {
      refetch();
      setSelectedTicketForDietary(null);
    });
  };

  return (
    <div style={{ width: 'auto' }}>
      <Button
        block
        loading={isRegLoading}
        icon={<Ticket01 width={16} height={16} />}
        onClick={() => {
          startLoading();
          checkIsFreeEvent();
        }}
      >
        Register
      </Button>

      <ConfirmModal
        isOpen={!!registerEvent}
        title="Proceed to checkout?"
        description="This is a paid event and requires payment now to ensure your spot is reserved. Proceed to ticket checkout?"
        confirmButtonText="Register"
        isLoading={isRegLoading}
        onClose={() => {
          setRegisterEvent(null);
          finishLoading();
        }}
        onConfirm={() => registerEvent && registerToEvent(registerEvent)}
      />

      <CancelTicketModal
        open={!!selectedTicketToCancelRegistration}
        onCancel={() => setSelectedTicketToCancelRegistration(null)}
        onNominateTicket={() =>
          setSelectedTicketForNominate(selectedTicketToCancelRegistration)
        }
        onCancelTicket={() =>
          setSelectedTicketForCancel(selectedTicketToCancelRegistration)
        }
      />

      <ConfirmModal
        isOpen={!!selectedTicketForCancel}
        title="Cancel ticket?"
        confirmButtonText="Refund"
        confirmButtonProps={{ danger: true }}
        isLoading={isCancelTicketLoading}
        onClose={() => setSelectedTicketForCancel(null)}
        onConfirm={cancelTicket}
      />

      <NominateTicketModal
        open={!!selectedTicketForNominate}
        isLoading={isNominateTicketLoading}
        onCancel={() => setSelectedTicketForNominate(null)}
        onNominateTicket={nominateTicket}
      />

      <EventDietaryModal
        open={!!selectedTicketForDietary}
        ticket={selectedTicketForDietary}
        isLoading={isChangeTicketLoading}
        onCancel={() => setSelectedTicketForDietary(null)}
        onChange={changeTicketDietary}
      />
    </div>
  );
};

export default EventsRegisterButton;
