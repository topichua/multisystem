import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { isNil } from 'lodash';
import { useState } from 'react';
import { userCpdApi } from 'src/transport/userCpd/userCpd.api';

export const useDocumentDetails = (documentResponse: any) => {
  const {
    title,
    categoryName,
    presenter,
    domain,
    completedDate,
    attachments,
    cpdId,
  } = documentResponse;

  return {
    title,
    categoryName,
    presenter,
    domain,
    completedDate,
    attachments,
    cpdId,
  };
};

export const useCpdCertificate = (cpdId: string) => {
  const [cpdCertificate] = useState<string>();
  const [
    isCpdCertificateLoading,
    {
      setFalse: setFalseCpdCertificateLoading,
      setTrue: setTrueCpdCertificateLoading,
    },
  ] = useBoolean(false);

  const getCpdCertificate = async () => {
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
    } finally {
      setFalseCpdCertificateLoading();
    }
  };

  return { cpdCertificate, isCpdCertificateLoading, getCpdCertificate };
};

export const usePreviewCpdCertificate = (cpdId: string) => {
  const [cpdCertificate, setCpdCertificate] = useState<string>();
  const [
    isModalVisible,
    { setFalse: setModalVisibleFalse, setTrue: setModalVisibleTrue },
  ] = useBoolean(false);
  const [
    isReviewCpdCertificateLoading,
    {
      setFalse: setFalseReviewCpdCertificateLoading,
      setTrue: setTrueReviewCpdCertificateLoading,
    },
  ] = useBoolean(false);

  const resetPreviewState = () => {
    setCpdCertificate(undefined);
    setModalVisibleFalse();
  };

  const getPreviewCpdCertificate = async () => {
    try {
      setTrueReviewCpdCertificateLoading();
      const certificate = await userCpdApi.getCpdCertificate(cpdId);

      if (!isNil(certificate?.data?.previewUrl)) {
        setCpdCertificate(certificate?.data?.previewUrl);
        setModalVisibleTrue();
      } else {
        notification.error({ message: 'Error' });
      }
    } catch (error) {
      notification.error({ message: 'Error' });
    } finally {
      setFalseReviewCpdCertificateLoading();
    }
  };

  return {
    cpdCertificate,
    isModalVisible,
    isReviewCpdCertificateLoading,
    resetPreviewState,
    getPreviewCpdCertificate,
    setModalVisibleFalse,
  };
};

export const useDownloadCpdCertificate = (cpdId: string) => {
  const [
    isDownloading,
    { setFalse: setDownloadingFalse, setTrue: setDownloadingTrue },
  ] = useBoolean(false);

  const handleDownload = async () => {
    try {
      setDownloadingTrue();
      const certificate = await userCpdApi.getCpdCertificate(cpdId);
      if (!isNil(certificate?.data?.previewUrl)) {
        const response = await fetch(certificate?.data?.previewUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const fileName = cpdId.split('/').pop() || 'download.htm';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        notification.error({ message: 'Not found' });
      }
    } catch (error) {
      notification.error({ message: 'Error' });
    } finally {
      setDownloadingFalse();
    }
  };

  return { isDownloading, handleDownload };
};

export const useLoadingState = (
  isCpdCertificateLoading: boolean,
  isReviewCpdCertificateLoading: boolean,
  isDownloading: boolean
) => {
  return (
    isCpdCertificateLoading || isReviewCpdCertificateLoading || isDownloading
  );
};
