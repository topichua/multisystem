import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Invoice } from './invoice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from 'src/components/common/Button/Button';
import { ArrowLeft } from '@untitled-ui/icons-react';
import { Stack } from 'src/components/common/Stack/Stack';
import { formatDate } from 'src/utils/date-time';
import { getInvoice } from 'src/transport/invoice/invoice.api';
import { Skeleton } from 'antd';
import { InvoiceDetails } from 'src/transport/invoice/invoice.dto';

export const InvoicePage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<InvoiceDetails>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getInvoice(id).then((data) => {
        setInvoice(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading || !invoice) {
    return <Skeleton active />;
  }

  return (
    <div
      style={{
        maxWidth: 595,
        margin: '40px auto',
        position: 'relative',
      }}
    >
      <Stack distribution="equalSpacing" alignment="center">
        <Button icon={<ArrowLeft />} type="text" onClick={() => navigate(-1)}>
          Back to Invoices
        </Button>
        <PDFDownloadLink
          document={<Invoice invoice={invoice} />}
          fileName={'invoice_' + formatDate(invoice.invoiceDate) + '.pdf'}
        >
          {({ loading }) => (
            <Button size="small" type="primary">
              {loading ? 'Loading document...' : 'Download now'}
            </Button>
          )}
        </PDFDownloadLink>
      </Stack>
      <Invoice invoice={invoice} />
    </div>
  );
};
