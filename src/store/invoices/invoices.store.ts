import { action, makeObservable, observable, reaction } from 'mobx';
import { getInvoices } from 'src/transport/invoice/invoice.api';
import {
  GetInvoicesResponse,
  Invoice,
  InvoiceStatus,
} from 'src/transport/invoice/invoice.dto';
import { membershipProfileApi } from 'src/transport/membership/membership-profile';

export class InvoicesStore {
  public isDataLoading: boolean = false;
  public isInvoicesLoading: boolean = false;
  public invoices: Array<Invoice> | null = null;
  public invoicesResponse: GetInvoicesResponse | null = null;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public total: number = 0;

  public updatePaymentLink: string | null = null;

  constructor() {
    makeObservable(this, {
      isDataLoading: observable,
      isInvoicesLoading: observable,
      updatePaymentLink: observable,
      loadInvoices: action.bound,
      loadUpdatePaymentLink: action.bound,
      invoices: observable,
      invoicesResponse: observable,
      currentPage: observable,
      pageSize: observable,
      total: observable,
    });
    reaction(
      () => [this.currentPage, this.pageSize],
      () => {
        this.loadInvoices(this.currentPage, this.pageSize);
      }
    );
  }

  public async loadInvoices(page: number, pageSize: number) {
    this.isInvoicesLoading = true;
    this.invoicesResponse = await getInvoices(page, pageSize);

    this.invoices = this.invoicesResponse.invoices.map((x) => {
      return {
        guid: x.id,
        id: x.invoiceNum,
        date: new Date(x.invoiceDate),
        description: `${x.description}`,
        statusString: x.status,
        balanceDue: x.balanceDue,
        paymentUrl: x.paymentUrl,
        totalAmountIncGst: x.totalAmountIncGst,
        status: InvoiceStatus.Default,
        totalChargeIncludingGst: x.netTotalAmount,
      };
    });

    this.currentPage = this.invoicesResponse.page;
    this.pageSize = this.invoicesResponse.size;
    this.total = this.invoicesResponse.totalItems;
    this.isInvoicesLoading = false;
  }

  public async loadUpdatePaymentLink() {
    membershipProfileApi.getUpdatePaymentLink().then((res) => {
      this.updatePaymentLink = res.data;
    });
  }
}
