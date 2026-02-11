import axiosBond from '../axios/axios-bond-instance';

import {
  AddItemToCartDto,
  Cart,
  CartItem,
  CheckoutDto,
  RemoveItemFromCartDto,
  UpdateItemDto,
} from './events.cart.dto';

export const eventsCartApi = {
  async createCart(userId: string): Promise<{ data: Cart }> {
    return await axiosBond.post(`/api/cart/new?userId=${userId}`);
  },

  async getCart(cartId: string): Promise<{ data: Cart }> {
    return await axiosBond.get(`/api/cart/${cartId}`);
  },

  async addItemToCart(options: AddItemToCartDto): Promise<{ data: CartItem }> {
    return await axiosBond.post(`/api/cart/additem`, options);
  },

  async updateItem(options: UpdateItemDto): Promise<{ data: CartItem }> {
    return await axiosBond.post(`/api/cart/updateitem`, options);
  },

  async removeItemFromCart(
    options: RemoveItemFromCartDto
  ): Promise<{ data: boolean; message: string }> {
    return await axiosBond.post(`/api/cart/removeItem`, options);
  },

  async checkout(
    options: CheckoutDto
  ): Promise<{ data: { checkoutUrl: string } }> {
    return await axiosBond.post(`/api/cart/checkout`, options);
  },
};
