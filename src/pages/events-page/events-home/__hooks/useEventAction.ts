import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { eventsApi } from 'src/transport/events/events.api';
import { NominateTicketParams } from 'src/transport/events/events.cart.dto';
import { ChangeTicketDietaryDto } from 'src/transport/events/events.dto';

export const useEventAction = () => {
  const [
    isRegisterTicketLoading,
    {
      setTrue: startRegisterTicketLoading,
      setFalse: finishRegisterTicketLoading,
    },
  ] = useBoolean(false);

  const [
    isCancelTicketLoading,
    { setTrue: startCancelTicketLoading, setFalse: finishCancelTicketLoading },
  ] = useBoolean(false);
  const [
    isNominateTicketLoading,
    {
      setTrue: startNominateTicketLoading,
      setFalse: finishNominateTicketLoading,
    },
  ] = useBoolean(false);
  const [
    isChangeTicketLoading,
    {
      setTrue: startChangeTicketDietaryLoading,
      setFalse: finishChangeTicketDietaryLoading,
    },
  ] = useBoolean(false);

  const registerToEvent = (ticketId: string, userId: string) => {
    startRegisterTicketLoading();

    return eventsApi
      .registerToEvent(ticketId, userId)
      .then(() => {
        notification.success({
          message: 'Registered successfully!',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Failed to register for event. Try again.',
        });
      })
      .finally(finishRegisterTicketLoading);
  };

  const cancelTicket = (ticketId: string) => {
    startCancelTicketLoading();

    return eventsApi
      .cancelTicket(ticketId)
      .then((res) => {
        if (!res.data) {
          notification.error({
            message: res.message || 'Failed to cancel ticket. Try again',
          });

          return res.data;
        }

        notification.success({
          message: 'Canceled successfully!',
        });

        return res.data;
      })
      .catch(() => {
        notification.error({
          message: 'Failed to cancel ticket. Try again',
        });
      })
      .finally(finishCancelTicketLoading);
  };

  const nominateTicket = (data: NominateTicketParams) => {
    startNominateTicketLoading();

    return eventsApi
      .nominateTicket(data)
      .then((res) => {
        if (!res.data) {
          notification.error({
            message: res.message || 'Failed to nominate ticket. Try again',
          });

          return res.data;
        }

        notification.success({
          message: 'Nominated successfully!',
        });

        return res.data;
      })
      .catch(() => {
        notification.error({
          message: 'Failed to nominate ticket. Try again',
        });
      })
      .finally(finishNominateTicketLoading);
  };

  const changeTicketDietary = (data: ChangeTicketDietaryDto) => {
    startChangeTicketDietaryLoading();

    return eventsApi
      .changeTicketDietary(data)
      .then((res) => {
        notification.success({
          message: 'Changed ticket successfully!',
        });

        return res;
      })
      .catch(() => {
        notification.error({
          message: 'Failed to change ticket dietary. Try again',
        });
      })
      .finally(finishChangeTicketDietaryLoading);
  };

  return {
    isCancelTicketLoading,
    isNominateTicketLoading,
    isRegisterTicketLoading,
    isChangeTicketLoading,
    registerToEvent,
    cancelTicket,
    nominateTicket,
    changeTicketDietary,
  };
};
