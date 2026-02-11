import { Check, Receipt, ReverseLeft, X } from '@untitled-ui/icons-react';
import { Empty, notification, Table, Typography } from 'antd';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { components } from 'src/styled/definitions/colors';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Invoice } from 'src/transport/invoice/invoice.dto';
import { Tag } from 'src/components/common/Tag/Tag';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useInvoicesStore } from './invoices.provider';
import {
  downloadInvoice,
  downloadInvoiceView,
} from 'src/transport/invoice/invoice.api';
import { usePDF } from '@react-pdf/renderer';
import { formatDateTime } from 'src/utils/date-time';
import { AxiosError } from 'axios';
import { Title } from 'src/components/common/Typography/Title';
import CREDIT_CARD from 'src/assets/icons/credit_card.png';
import { downloadFile } from 'src/utils/file';

const { Text } = Typography;

interface IStatusBadge {
  text: string;
  color: string;
  icon: React.ReactNode;
}

var statusBadgesMap: Array<IStatusBadge> = [
  {
    color: 'success',
    icon: <Check width={12} height={12} />,
    text: 'Paid',
  },
  {
    color: 'error',
    icon: <X width={12} height={12} />,
    text: 'Cancelled',
  },
  {
    color: 'default',
    icon: <ReverseLeft width={12} height={12} />,
    text: 'Refunded',
  },
  {
    color: 'default',
    icon: null,
    text: 'Pending',
  },
];

const getStatusBadge = (invoice: Invoice): IStatusBadge => {
  const status = invoice.statusString ?? '';
  let fromMap = statusBadgesMap.find((x) => x.text == status);
  if (fromMap == null) fromMap = { color: 'default', icon: null, text: status };
  return fromMap;
};

function saveBlobAsPDF(blob: Blob, filename = 'file.pdf') {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export const InvoicesPageSection = observer(() => {
  const [current] = usePDF();
  const [loadedGuid, setLoadedGuid] = useState<string | null>(null);
  const [loadingPreviewGuid, setLoadingPreviewGuid] = useState<string | null>(
    null
  );
  const [invoiceIsDownloading, setInvoiceIsDownloading] = useState<
    string | null
  >(null);

  const {
    invoices,
    isInvoicesLoading,
    currentPage,
    pageSize,
    total,
    updatePaymentLink,
    loadInvoices,
    loadUpdatePaymentLink,
  } = useInvoicesStore();

  const previewInvoice = (itemGuid: string) => {
    setLoadingPreviewGuid(itemGuid);
    downloadInvoiceView(itemGuid)
      .then((res) => window.open(res.previewUrl))
      .catch((e) => {
        notification.error({
          message: 'Error fetching preview. Try again.',
          description: (e as AxiosError)?.response?.data as string,
        });
      })
      .finally(() => setLoadingPreviewGuid(null));
  };

  const getInvoice = (
    invoiceGuid: string,
    invoiceId: number,
    invoiceDate: Date
  ) => {
    setInvoiceIsDownloading(invoiceGuid);
    downloadInvoice(invoiceGuid)
      .then((res) => {
        downloadFile(
          res,
          `Invoice #${invoiceId}-${dayjs(invoiceDate).format('DD_MM_YYYY')}`
        );
      })
      .catch((e) => {
        notification.error({
          message: 'Error during dowload Invoice. Try again.',
          description: (e as AxiosError)?.response?.data as string,
        });
      })
      .finally(() => setInvoiceIsDownloading(null));
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: 'Invoice',
      key: 'id',
      render: (_, { id }) => <Text>#{id}</Text>,
      width: 200,
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, { date }) => <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>,
      width: 200,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, item) => {
        let badge = getStatusBadge(item);
        return (
          <Tag size="small" icon={badge.icon} color={badge.color}>
            {badge.text}
          </Tag>
        );
      },
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, { description }) => {
        return <Text>{description}</Text>;
      },
    },
    {
      title: 'Amount',
      key: 'totalAmountIncGst',
      render: (_, { totalAmountIncGst }) => {
        return <Text>{totalAmountIncGst}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      render: (_, item) => {
        return (
          <Stack split="•" spacing="extraTight" alignment="center">
            <Button
              style={{ color: components.colors.primary }}
              type="link"
              loading={item.guid === loadingPreviewGuid}
              onClick={() => previewInvoice(item.guid)}
            >
              Preview
            </Button>
            <Button
              style={{ color: components.colors.primary }}
              type="link"
              onClick={() => getInvoice(item.guid, item.id, item.date)}
              loading={item.guid === invoiceIsDownloading}
            >
              Download
            </Button>
            {item.balanceDue > 0 && (
              <Button
                style={{ color: components.colors.primary }}
                type="link"
                onClick={() => window.open(item.paymentUrl)}
              >
                Pay
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  useEffect(() => {
    if (current.blob && loadedGuid) {
      const invoice = invoices?.find((_) => _.guid == loadedGuid);
      saveBlobAsPDF(
        current.blob,
        invoice?.id + '_' + formatDateTime(invoice?.date || '')
      );
      setLoadedGuid(null);
    }
  }, [current.blob, loadedGuid, invoices]);

  useEffect(() => {
    loadInvoices(currentPage, pageSize);
    loadUpdatePaymentLink();
  }, []);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Receipt color={components.colors.brandColor} />}
          title="Invoices"
        />
      </FixedContentHeader>

      <Page.Content style={{ width: '100%', minHeight: 500, margin: '0 auto' }}>
        <Stack vertical spacing="extraLoose">
          <Stack alignment="center">
            <Stack.Item fill>
              <Stack alignment="center">
                <Title level={5} fontWeight={700}>
                  Payment method
                </Title>
                <img src={CREDIT_CARD} alt="Credit card" />
              </Stack>
            </Stack.Item>

            {updatePaymentLink && (
              <Button
                type="primary"
                onClick={() => window.open(updatePaymentLink, '_blank')}
              >
                Update payment
              </Button>
            )}
          </Stack>

          <Table<Invoice>
            columns={columns}
            rowKey={(x) => x.id}
            dataSource={invoices ?? []}
            pagination={{
              position: ['bottomCenter'],
              current: currentPage,
              pageSize: pageSize,
              total: total,
            }}
            loading={isInvoicesLoading}
            locale={{
              emptyText: !isInvoicesLoading && <Empty description="No Data" />,
            }}
            onChange={(pagination) => {
              loadInvoices(pagination.current ?? 1, pagination.pageSize ?? 10);
            }}
          />
        </Stack>
      </Page.Content>
    </>
  );
});
