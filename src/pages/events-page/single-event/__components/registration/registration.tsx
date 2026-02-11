import { useMemo, useState } from 'react';
import { Select, Tooltip, notification } from 'antd';
import { useBoolean } from 'ahooks';

import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { EventTicket } from 'src/transport/events/events.dto';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { eventsCartApi } from 'src/transport/events/events.cart.api';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

import * as S from './registration.styled';

type RegistrationValue = {
  ticketPriceId: string | null;
  quantity: number;
};

type RegistrationProps = {
  tickets: EventTicket[];
};

export const Registration = ({ tickets }: RegistrationProps) => {
  const { user } = useCurrentUserStore();

  const [form, setForm] = useState<RegistrationValue>({
    ticketPriceId: null,
    quantity: 1,
  });
  const [
    isOpenConfirmModal,
    { setTrue: openConfirmModal, setFalse: closeConfirmModal },
  ] = useBoolean(false);
  const [
    isCheckoutLoading,
    { setTrue: startCheckout, setFalse: finishCheckout },
  ] = useBoolean(false);

  const checkout = async () => {
    if (!user) return;
    startCheckout();

    try {
      const { data: createdCart } = await eventsCartApi.createCart(user.id);

      await eventsCartApi.addItemToCart({
        cartId: createdCart.cartId,
        itemPriceId: form.ticketPriceId as string,
      });

      if (form.quantity > 1) {
        await eventsCartApi.updateItem({
          cartId: createdCart.cartId,
          itemPriceId: form.ticketPriceId as string,
          quantity: form.quantity,
        });
      }

      const {
        data: { checkoutUrl },
      } = await eventsCartApi.checkout({
        cartId: createdCart.cartId,
        userId: user.id,
      });

      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');

      closeConfirmModal();
      setForm({ ticketPriceId: null, quantity: 1 });
    } catch (e: any) {
      notification.error({
        message: 'Checkout error. Try again.',
        description: e.response.data.message,
      });
    } finally {
      finishCheckout();
    }
  };

  const options = useMemo(() => {
    return tickets.map((ticket) => ({
      value: ticket.ticketPriceId,
      label: ticket.name,
    }));
  }, [tickets]);

  const selectedTicket = useMemo(() => {
    return tickets.find(
      (ticket) => ticket.ticketPriceId === form.ticketPriceId
    );
  }, [form.ticketPriceId]);

  const isDisable = !form.ticketPriceId || selectedTicket?.soldOut;

  return (
    <S.Card title="Registration">
      <Stack vertical>
        <Select
          placeholder="Select ticket type"
          options={options}
          style={{ width: '100%' }}
          value={form.ticketPriceId}
          onChange={(value) => setForm({ ...form, ticketPriceId: value })}
        />

        <S.InputNumber
          step={1}
          prefix="Qty."
          min={1}
          style={{ width: '100%', textAlign: 'center' }}
          value={form.quantity}
          onChange={(value) => setForm({ ...form, quantity: value as number })}
        />

        <Tooltip title={selectedTicket?.soldOut ? 'No tickets left' : ''}>
          <Button
            block
            type="primary"
            size="large"
            disabled={isDisable}
            loading={isCheckoutLoading}
            onClick={() => {
              if (selectedTicket?.amount === 0) {
                checkout();
              } else {
                openConfirmModal();
              }
            }}
          >
            Register
          </Button>
        </Tooltip>
      </Stack>

      <ConfirmModal
        title="Proceed to checkout?"
        description="This is a paid event and requires payment now to ensure your spot is reserved. Proceed to ticket checkout?"
        isOpen={isOpenConfirmModal}
        isLoading={isCheckoutLoading}
        confirmButtonText="Proceed"
        onClose={closeConfirmModal}
        onConfirm={checkout}
      />
    </S.Card>
  );
};
