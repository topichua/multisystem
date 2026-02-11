export type Invoice = {
  balanceDue: number;
  date: Date;
  description: string;
  guid: string;
  id: number;
  paymentUrl: string | URL | undefined;
  status: InvoiceStatus;
  statusString?: string;
  totalAmountIncGst: number;
  totalChargeIncludingGst: number;
};

export enum InvoiceStatus {
  Default = 0,
  Paid = 1,
  Cancelled = 2,
  Refunded = 3,
}

export type InvoiceItem = {
  amountPaid: number;
  balanceDue: number;
  description: string;
  id: string;
  invoiceDate: string;
  invoiceNum: number;
  memberNum: string;
  netTotalAmount: number;
  orgId: string;
  orgName: string;
  paymentUrl: any;
  status: string;
  totalAmountIncGst: number;
  userFullName: string;
  userId: string;
};

export type GetInvoicesResponse = {
  invoices: InvoiceItem[];
  page: number;
  size: number;
  sortField: string | null;
  sortOrder: string | null;
  totalItems: number;
  userId: string;
};

export type GetInvoiceDetailsApiResponse = {
  message: string | null;
  data: {
    invoice: InvoiceDetails;
  };
};

export type InvoiceDetails = {
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  id: string;
  invoiceDate: string;
  invoiceNum: number;
  lineItems: {
    itemName: string;
    quantity: number;
    totalPrice: number;
    unitPrice: number;
  }[];
  memberNum: string;
  membershipEndDate: string | null;
  membershipStartDate: string | null;
  netTotalAmount: number;
  orgId: string | null;
  orgName: string | null;
  paymentUrl: string;
  status: string;
  totalAmountExcGst: number;
  totalAmountIncGst: number;
  totalAmountPaid: number;
  totalDiscount: number;
  totalGst: number;
  userFullName: string;
  userId: string;
};

export type InvoiceLineItem = {
  go1AccessURL: string;
  itemName: string;
  quantity: number;
  stripeAccountId: string | null;
  stripeProductId: string | null;
  totalPrice: number;
  unitPrice: number;
};

export type InvoiceTransaction = {
  amount: number;
  date: string;
  status: string;
};
