import { PaginationResponse } from 'src/transport/types.ts';

export type GetServerValuesResponse = Promise<
  PaginationResponse<{
    serverValues: ServerValueDTO[];
  }>
>;

export type GetGlobalTermsResponse = {
  terms: ServerValueDTO | null;
};

export interface ServerValueDTO {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
  updatedByUserId: string;
}
