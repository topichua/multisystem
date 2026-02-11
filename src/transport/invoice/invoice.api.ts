import axios from '../axios/axios-bond-instance';
import {
  GetInvoiceDetailsApiResponse,
  GetInvoicesResponse,
} from './invoice.dto';
import { AxiosResponse } from 'axios';
import axiosBondInstance from '../axios/axios-bond-instance';

export const getInvoices = async (
  page: number,
  pageSize: number
): Promise<GetInvoicesResponse> => {
  try {
    const response: AxiosResponse<GetInvoicesResponse> = await axios.post(
      `/api/user/invoices?page=${page}&pageSize=${pageSize}`,
      {
        invoiceDateFrom: null,
        invoiceDateTo: null,
        page: page,
        size: 10,
        sortOrder: null,
        sortField: null,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
};

export const getInvoice = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse<GetInvoiceDetailsApiResponse> =
      await axios.get(`/api/invoice/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    throw new Error('Failed to fetch invoice details');
  }
};

export const downloadInvoiceView = async (id: string): Promise<any> => {
  try {
    const response: AxiosResponse<GetInvoiceDetailsApiResponse> =
      await axios.get(`/api/invoice/${id}/printview`);
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice view:', error);
    throw new Error('Failed to download invoice view');
  }
};

export const downloadInvoice = async (id: string): Promise<any> => {
  return axiosBondInstance.get(`/api/invoice/${id}/download`, {
    responseType: 'arraybuffer',
  });
};
