import {
  Certificate01,
  ChevronDown,
  ChevronUp,
  Download03,
  Printer,
  Share05,
} from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Button, Col, Modal, notification, Typography } from 'antd';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import { FC, useCallback, useMemo, useState } from 'react';
import { Divider } from 'src/components/common/Divider/Divider.tsx';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title.tsx';
import CPDProgress from 'src/pages/cpd/components/CPD-progress.tsx';
import { components } from 'src/styled/definitions/colors';
import { userCpdApi } from 'src/transport/userCpd/userCpd.api';
import { CpdRecordDTO } from 'src/transport/userCpd/userCpd.dto';
import { downloadFile } from 'src/utils/file.tsx';

import { StyledInnerCard } from '../cpd.periods.styled';
import { formatDateRange } from '../cpd.periods.utils';
import './cpd.periods.css';
import * as S from './cpd.periods.styled';
import { CertificateDisplay } from './certificate.display';

const { Text } = Typography;

const largeIconSizes = {
  width: 18,
  height: 18,
};

export type TCpdData = {
  cpdId?: string;
  cpdPeriods?: Array<CpdRecordDTO>;
};

export interface CpdDataProps extends TCpdData {
  test?: string;
}

type PeriodProps = {
  onClick?: () => void;
  cpdPeriodId?: string;
  completedTotalHours?: number;
  minimumRequiredHours?: number;
  cpdRecords?: CpdRecordDTO[];
  startDate: string;
  endDate: string;
};

export const Period: FC<PeriodProps> = ({
  onClick = noop,
  completedTotalHours,
  minimumRequiredHours,
  cpdRecords,
  startDate,
  endDate,
  cpdPeriodId,
}) => {
  const dateRange = useMemo(() => {
    return formatDateRange(startDate, endDate, 'Australia/Sydney');
  }, [endDate, startDate]);

  const [cpdPeriodSummary, setCpdPeriodSummary] = useState<string>();

  const [isModalVisible, { setFalse: setModalVisibleFalse }] =
    useBoolean(false);
  const resetPreviewState = useCallback(() => {
    setCpdPeriodSummary(undefined);
    setModalVisibleFalse();
  }, [setModalVisibleFalse]);

  // const [
  //   isReviewCpdCertificateLoading,
  //   {
  //     setFalse: setFalseReviewCpdPeriodSummaryLoading,
  //     setTrue: setTrueReviewCpdPeriodSummaryLoading,
  //   },
  // ] = useBoolean(false);

  // const getPreviewCpdPeriodSummary = useCallback(async () => {
  //   try {
  //     setTrueReviewCpdPeriodSummaryLoading();
  //     const certificate = await userCpdApi.getCpdPeriodSummary(
  //       cpdPeriodId || ''
  //     );

  //     if (!isNil(certificate?.data?.previewUrl)) {
  //       setCpdPeriodSummary(certificate?.data?.previewUrl);
  //       setModalVisibleTrue();
  //     } else {
  //       notification.error({ message: 'Error' });
  //     }
  //   } catch (e) {
  //     notification.error({ message: 'Error' });
  //     console.log(e);
  //   } finally {
  //     setFalseReviewCpdPeriodSummaryLoading();
  //   }
  // }, [
  //   cpdPeriodId,
  //   setFalseReviewCpdPeriodSummaryLoading,
  //   setModalVisibleTrue,
  //   setTrueReviewCpdPeriodSummaryLoading,
  // ]);

  const [
    isDownloading,
    { setFalse: setDownloadingFalse, setTrue: setDownloadingTrue },
  ] = useBoolean(false);

  const [isPrinting, { setFalse: setPrintingFalse, setTrue: setPrintingTrue }] =
    useBoolean(false);

  const [
    isCpdPeriodSummaryLoading,
    {
      setFalse: setFalseCpdPeriodSummaryLoading,
      setTrue: setTrueCpdPeriodSummaryLoading,
    },
  ] = useBoolean(false);

  const handleDownload = useCallback(async () => {
    try {
      setDownloadingTrue();
      const certificateArrayBuffer = await userCpdApi.downloadCpdPeriodSummary(
        cpdPeriodId || ''
      );

      if (certificateArrayBuffer) {
        downloadFile(certificateArrayBuffer, `cpd-summary-${cpdPeriodId}.pdf`);
      } else {
        notification.error({ message: 'Not found' });
      }
    } catch {
      notification.error({ message: 'Error' });
    } finally {
      setDownloadingFalse();
    }
  }, [cpdPeriodId, setDownloadingFalse, setDownloadingTrue]);

  const getCpdPeriodSummary = useCallback(async () => {
    try {
      setTrueCpdPeriodSummaryLoading();
      const certificate = await userCpdApi.getCpdPeriodSummary(
        cpdPeriodId || ''
      );

      if (!isNil(certificate?.data?.previewUrl)) {
        window.open(
          certificate.data.previewUrl,
          '_blank',
          'noopener,noreferrer'
        );
      } else {
        notification.error({ message: 'Error' });
      }
    } catch (error) {
      notification.error({ message: 'Error' });
      console.log(error);
    } finally {
      setFalseCpdPeriodSummaryLoading();
    }
  }, [
    cpdPeriodId,
    setFalseCpdPeriodSummaryLoading,
    setTrueCpdPeriodSummaryLoading,
  ]);

  const printCpdPeriodSummary = useCallback(() => {
    setPrintingTrue();

    userCpdApi
      .getCpdPeriodSummary(cpdPeriodId || '')
      .then((certificate) => {
        if (!isNil(certificate?.data?.previewHtml)) {
          const iframe = document.createElement('iframe');

          iframe.style.position = 'absolute';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = 'none';
          iframe.style.visibility = 'hidden';

          document.body.appendChild(iframe);

          iframe.contentDocument?.open();
          iframe.contentDocument?.write(certificate.data.previewHtml);
          iframe.contentDocument?.close();

          iframe.onload = function () {
            iframe.contentWindow?.print();
            document.body.removeChild(iframe);
            setPrintingFalse();
          };
        } else {
          notification.error({ message: 'Error during printing document' });
        }
      })
      .catch((e) => {
        notification.error({ message: 'Error during loading document' });
        console.log(e);
      });
  }, [cpdPeriodId]);

  return (
    <>
      <Title level={5} fontWeight={800}>
        CPD Period: {dateRange} (Completed {completedTotalHours} hrs)
      </Title>
      <StyledInnerCard onClick={onClick}>
        <Stack vertical spacing="loose">
          <Stack vertical spacing="loose">
            <CPDProgress
              completedTotalHours={completedTotalHours}
              minimumRequiredHours={minimumRequiredHours}
            />
            {cpdRecords && cpdRecords?.length > 0 && (
              <Stack>
                <Button
                  loading={isCpdPeriodSummaryLoading}
                  onClick={getCpdPeriodSummary}
                  type="default"
                  icon={<Share05 {...largeIconSizes} />}
                >
                  Open
                </Button>
                {/* <Button
                  loading={isReviewCpdCertificateLoading}
                  onClick={getPreviewCpdPeriodSummary}
                  type="default"
                  icon={<Scale01 {...largeIconSizes} />}
                >
                  Preview
                </Button> */}
                <Button
                  type="default"
                  icon={<Download03 {...largeIconSizes} />}
                  onClick={handleDownload}
                  loading={isDownloading}
                >
                  Download
                </Button>
                <Button
                  type="default"
                  icon={<Printer {...largeIconSizes} />}
                  onClick={printCpdPeriodSummary}
                  loading={isPrinting}
                >
                  Print
                </Button>
              </Stack>
            )}
          </Stack>
          {cpdRecords && cpdRecords?.length > 0 && (
            <Col xs={24}>
              <S.Collapse
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <ChevronUp height={18} />
                  ) : (
                    <ChevronDown height={16} />
                  )
                }
                items={
                  cpdRecords?.length
                    ? [
                        {
                          key: 'key',
                          label: (
                            <Title level={5} fontWeight={600}>
                              View details
                            </Title>
                          ),
                          children: (
                            <>
                              <S.StyleStack vertical spacing="none">
                                {cpdRecords?.map((cpdRecord, index) => (
                                  <>
                                    <CertificateDisplay
                                      key={cpdRecord?.cpdId}
                                      documentResponse={cpdRecord}
                                    />
                                    {index !== cpdRecords.length - 1 && (
                                      <Divider />
                                    )}
                                  </>
                                ))}
                              </S.StyleStack>
                              <S.VerticalLine className="vertical-line" />
                            </>
                          ),
                        },
                      ]
                    : []
                }
                expandIconPosition="right"
              />
            </Col>
          )}
        </Stack>
        <Modal
          title={
            <Stack alignment="fill">
              <Certificate01 color={components.colors.brandColor} />
              <Text strong>Preview</Text>
            </Stack>
          }
          open={isModalVisible}
          onCancel={resetPreviewState}
          footer={null}
          centered
          transitionName="ant-fade"
          width="100%"
          style={{ top: 0, padding: 0, maxWidth: '100vw' }}
          styles={{ body: { height: '100vh', padding: 0, overflow: 'hidden' } }}
          wrapClassName="fullscreen-modal"
        >
          {cpdPeriodSummary && (
            <S.StyledIframe src={cpdPeriodSummary} title="Preview Content" />
          )}
        </Modal>
      </StyledInnerCard>
    </>
  );
};
