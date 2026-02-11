export type Cart = {
  cartId: string;
  userId: string;
  isPaid: boolean;
  cartItems: CartItem[];
};

export type CartItem = {
  cartItemId: string;
  itemPriceId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type AddItemToCartDto = {
  cartId: string;
  itemPriceId: string;
};

export type UpdateItemDto = {
  cartId: string;
  itemPriceId: string;
  quantity: number;
};

export type RemoveItemFromCartDto = {
  cartItemId: string;
};

export type CheckoutDto = {
  cartId: string;
  userId: string;
};

export type NominateTicketParams = {
  ticketId: string;
  nomineeTitle: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineeMobile: string;
  nomineeOrgName: string;
};

export type EventQueryParams = {
  eventId: string;
  queryDetails: string;
};
