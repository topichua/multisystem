import { FC, useState } from 'react';
import { Col, Row, Typography, Grid } from 'antd';
import {
  CartCardContainer,
  QuantityInput,
  TicketInfoContainer,
  TicketListContainer,
} from './add-event-to-cart.styled';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import Title from 'antd/es/typography/Title';
import { Divider } from 'src/components/common/Divider/Divider';
import { TicketDetails } from 'src/store/cart/cart-store';

const { Text } = Typography;
const { useBreakpoint } = Grid;

type AddEventToCartProps = {
  eventId: string;
  tickets: TicketDetails[];
};
export const AddEventToCart: FC<AddEventToCartProps> = ({ tickets }) => {
  const screens = useBreakpoint();

  const [ticketMap, setTicketMap] = useState<Map<string, TicketDetails>>(
    new Map(tickets.map((item) => [item.ticketPriceId, { ...item }]))
  );

  const totalPriceOfSelectedTickets = Array.from(ticketMap.values()).reduce(
    (sum, ticket) => sum + ticket.amount * ticket.quantity,
    0
  );

  const isAddToBagDisabled = Array.from(ticketMap.values()).every(
    (ticket) => ticket.quantity === 0
  );

  const shouldWrap =
    (!screens.xl && window.innerWidth >= 992 && window.innerWidth <= 1189) ||
    screens.xs;

  const handleQuantityChange = (id: string, quantity: number) => {
    setTicketMap((prevMap) => {
      const updatedMap = new Map(prevMap);
      const ticket = updatedMap.get(id);

      if (ticket) {
        ticket.quantity = quantity;
        updatedMap.set(id, ticket);
      }

      return updatedMap;
    });
  };

  return (
    <CartCardContainer title="Registration">
      <Stack vertical>
        <TicketListContainer>
          {Array.from(ticketMap.values()).map((ticketItem, index, array) => {
            return (
              <>
                <Row
                  key={ticketItem.ticketPriceId}
                  justify="space-between"
                  align="middle"
                  gutter={16}
                  wrap={shouldWrap}
                >
                  {/* Ticket Info */}
                  <TicketInfoContainer
                    flex="2 .5 100%"
                    isRowWrapped={shouldWrap}
                  >
                    <Title
                      level={5}
                      style={{ margin: 0 }}
                      ellipsis={{ tooltip: true }}
                    >
                      {ticketItem.name}
                    </Title>
                    <Text>{`$${ticketItem.amount}`}</Text>
                  </TicketInfoContainer>

                  {/* Quantity Input */}
                  <Col flex={shouldWrap ? '1 1 auto' : '0 1 auto'}>
                    <QuantityInput
                      size="large"
                      min={0}
                      value={ticketItem.quantity}
                      onChange={(value) =>
                        handleQuantityChange(
                          ticketItem.ticketPriceId,
                          (value as number) || 0
                        )
                      }
                    />
                  </Col>
                </Row>

                {array.length > 1 && index < array.length - 1 && (
                  <Divider spacing="loose" />
                )}
              </>
            );
          })}
        </TicketListContainer>

        <Button
          block
          type="primary"
          style={{ boxShadow: 'none' }}
          disabled={isAddToBagDisabled}
        >
          {`Add ticket(s) to bag ${isAddToBagDisabled ? '' : `~ $${totalPriceOfSelectedTickets}`}`}
        </Button>
      </Stack>
    </CartCardContainer>
  );
};

export default AddEventToCart;
