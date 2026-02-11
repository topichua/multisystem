import { PaginationResponse } from '../types';

export type FaqItem = {
  createdAt: string;
  createdByUserId: string;
  description: string;
  id: string;
  isDeleted: boolean;
  name: string;
  updatedAt: string;
  updatedByUserId: string;
};

export type FaqDto = PaginationResponse<{ faQs: FaqItem[] }>;
