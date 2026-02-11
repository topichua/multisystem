import {
  Certificate01,
  Download03,
  Edit04,
  FileAttachment03,
  Share05,
} from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Button, Modal, notification, Typography } from 'antd';
import isNil from 'lodash/isNil';
import { FC, useCallback, useState } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { components } from 'src/styled/definitions/colors';
import { userCpdApi } from 'src/transport/userCpd/userCpd.api';
import { CpdRecordDTO } from 'src/transport/userCpd/userCpd.dto';
import { downloadFile } from 'src/utils/file.tsx';

import { getCompletedDate } from '../cpd.periods.utils';
import './cpd.periods.css';
import * as S from './cpd.periods.styled';

const smallIconSizes = {
  width: 14,
  height: 14,
};

const { Text } = Typography;

export const CertificateDisplay: FC<{ documentResponse: CpdRecordDTO }> = ({
  documentResponse,
}) => {
  const {
    title,
    categoryName,
    presenter,
    domain,
    completedDate,
    attachments,
    cpdId,
    hours,
    editUrl,
  } = documentResponse;

  const [cpdCertificate, setCpdCertificate] = useState<string>();
  const [
    isAttachmentLoading,
    { setFalse: setAttachmentLoadingEnd, setTrue: setAttachmentLoadingStart },
  ] = useBoolean(false);
  const [
    isCpdCertificateLoading,
    {
      setFalse: setFalseCpdCertificateLoading,
      setTrue: setTrueCpdCertificateLoading,
    },
  ] = useBoolean(false);

  const getCpdCertificate = useCallback(async () => {
    try {
      setTrueCpdCertificateLoading();
      const certificate = await userCpdApi.getCpdCertificate(cpdId);

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
      setFalseCpdCertificateLoading();
    }
  }, [cpdId, setFalseCpdCertificateLoading, setTrueCpdCertificateLoading]);

  // const [
  //   isReviewCpdCertificateLoading,
  //   {
  //     setFalse: setFalseReviewCpdCertificateLoading,
  //     setTrue: setTrueReviewCpdCertificateLoading,
  //   },
  // ] = useBoolean(false);

  const [isModalVisible, { setFalse: setModalVisibleFalse }] =
    useBoolean(false);

  const resetPreviewState = useCallback(() => {
    setCpdCertificate(undefined);
    setModalVisibleFalse();
  }, [setModalVisibleFalse]);

  // const getPreviewCpdCertificate = useCallback(async () => {
  //   try {
  //     setTrueReviewCpdCertificateLoading();
  //     const certificate = await userCpdApi.getCpdCertificate(cpdId);

  //     if (!isNil(certificate?.data?.previewUrl)) {
  //       setCpdCertificate(certificate?.data?.previewUrl);
  //       setModalVisibleTrue();
  //     } else {
  //       notification.error({ message: 'Error' });
  //     }
  //   } catch (error) {
  //     notification.error({ message: 'Error' });
  //     console.log(error);
  //   } finally {
  //     setFalseReviewCpdCertificateLoading();
  //   }
  // }, [
  //   cpdId,
  //   setFalseReviewCpdCertificateLoading,
  //   setModalVisibleTrue,
  //   setTrueReviewCpdCertificateLoading,
  // ]);

  const [
    isDownloading,
    { setFalse: setDownloadingFalse, setTrue: setDownloadingTrue },
  ] = useBoolean(false);

  const downloadCertificate = useCallback(async () => {
    try {
      setDownloadingTrue();

      const certificateArrayBuffer =
        await userCpdApi.downloadCpdCertificate(cpdId);

      if (certificateArrayBuffer) {
        downloadFile(certificateArrayBuffer, `certificate-${cpdId}.pdf`);
      } else {
        notification.error({ message: 'Not found' });
      }
    } catch (error) {
      notification.error({ message: 'Error' });
      console.log(error);
    } finally {
      setDownloadingFalse();
    }
  }, [cpdId, setDownloadingFalse, setDownloadingTrue]);

  const downloadAttachment = (id: string, name: string) => {
    setAttachmentLoadingStart();
    userCpdApi
      .downloadCPDAttachment(id)
      .then((response) => {
        downloadFile(response, name);
      })
      .catch((err) => {
        notification.error({
          message: `Error downloading file. ${err}`,
        });
      })
      .finally(() => setAttachmentLoadingEnd());
  };

  return (
    <S.StyledCard size="small">
      <S.StyledTitle className="certificate-title" strong>
        <Certificate01 />
        {title}
      </S.StyledTitle>
      <Stack vertical>
        <Stack vertical>
          {hours && (
            <>
              <Text>Hours</Text>
              <Title level={5} fontWeight={600}>
                {hours || 0}
              </Title>
            </>
          )}
          {categoryName && (
            <>
              <Text>Category</Text>
              <Title level={5} fontWeight={600}>
                {categoryName}
              </Title>
            </>
          )}
          {presenter && (
            <>
              <Text>Presenter</Text>
              <Title level={5} fontWeight={600}>
                {presenter}
              </Title>
            </>
          )}
          {domain && (
            <>
              <Text>Domain</Text>
              <Title level={5} fontWeight={600}>
                {domain}
              </Title>
            </>
          )}
          {completedDate && (
            <>
              <Text> Completed Date</Text>
              <Title level={5} fontWeight={600}>
                {getCompletedDate(completedDate, 'Australia/Sydney')}
              </Title>
            </>
          )}
        </Stack>
        <Stack spacing="loose">
          <Button
            onClick={getCpdCertificate}
            size="small"
            type="default"
            loading={isCpdCertificateLoading}
            icon={<Share05 {...smallIconSizes} />}
          >
            Open
          </Button>
          {/* <Button
            size="small"
            type="default"
            onClick={getPreviewCpdCertificate}
            loading={isReviewCpdCertificateLoading}
            icon={<Scale01 {...smallIconSizes} />}
          >
            Preview
          </Button> */}
          <Button
            size="small"
            type="default"
            onClick={downloadCertificate}
            loading={isDownloading}
            icon={<Download03 {...smallIconSizes} />}
          >
            Download
          </Button>
          {editUrl?.trim() && (
            <Button
              onClick={() => window.open(documentResponse.editUrl, '_blank')}
              size="small"
              icon={<Edit04 {...smallIconSizes} />}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Stack>
      {attachments && attachments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Attachments:</Text>
          {attachments.map((attachment, index) => {
            return (
              <Stack
                alignment="center"
                key={attachment.id}
                distribution="equalSpacing"
                wrap={false}
              >
                <Stack alignment="center" spacing={'extraTight'}>
                  <FileAttachment03 height={18} style={{ display: 'block' }} />
                  <Stack.Item fill ellipsis>
                    <Text style={{ textOverflow: 'ellipsis' }}>
                      {attachment.name}
                    </Text>
                  </Stack.Item>
                </Stack>

                <Button
                  type="link"
                  onClick={() =>
                    downloadAttachment(attachment.id, attachment.name)
                  }
                  key={index}
                  loading={isAttachmentLoading}
                >
                  Download
                </Button>
              </Stack>
            );
          })}
        </div>
      )}

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
        {cpdCertificate && (
          <S.StyledIframe src={cpdCertificate} title="Preview Content" />
        )}
      </Modal>
    </S.StyledCard>
  );
};
