import {
  FileAttachment02,
  Image01,
  LayoutGrid02,
  Play,
  PresentationChart01,
  VideoRecorder,
} from '@untitled-ui/icons-react';
import {
  Button,
  Col,
  Flex,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Typography,
} from 'antd';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { FC, useState } from 'react';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

import { Stack } from 'src/components/common/Stack/Stack';
import { DIRECTUS_ASSETS_URL } from 'src/transport/directus.utils';
import { ResourceFileDeepsDTO } from '../types/resources.types';

import 'react-pdf/dist/Page/TextLayer.css';

const documentOptions = {
  httpHeaders: {
    'Content-Type': 'text/javascript',
  },
  cMapUrl: '/cmaps/',
};

export const AttachmentButton = styled(Button)`
  border-color: #f2f4f7;
`;

export const SkeletonNode = styled(Skeleton.Button)`
  height: 36px;
  width: 100% !important;
`;

export const StyledDocument = styled(Document)`
  & div.annotationLayer {
    display: none;
  }
`;
const PdfPaginationWrapper = styled(Stack)`
  position: sticky;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 22;
  background-color: white;
  /* border: 1px solid ${(props) =>
    props.theme.colors.components.border.primaryBorder}; */
  padding-top: 10px;
  border-radius: ${(props) => props.theme.radius.large};
  padding-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: box-shadow 350ms ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }
`;

const { Text } = Typography;

type FileType =
  | 'image'
  | 'audio'
  | 'video'
  | 'other'
  | 'application/pdf'
  | 'text';

interface PreviewContent {
  src: string;
  type: FileType;
}

const getFileIcon = (fileType: string, fileName: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'image/': Image01,
    'video/': VideoRecorder,
    'audio/': Play,
    'application/pdf': FileAttachment02,
    'text/': FileAttachment02,
    'application/msword': FileAttachment02,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      FileAttachment02,
    'application/vnd.ms-excel': LayoutGrid02,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      LayoutGrid02,
    'application/vnd.ms-powerpoint': PresentationChart01,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      PresentationChart01,
  };

  for (const [key, Icon] of Object.entries(iconMap)) {
    if (fileType?.startsWith(key)) return Icon;
  }

  const extension = fileName?.split('.').pop()?.toLowerCase() ?? '';
  if (['doc', 'docx'].includes(extension)) return FileAttachment02;
  if (['xls', 'xlsx'].includes(extension)) return LayoutGrid02;
  if (['ppt', 'pptx'].includes(extension)) return PresentationChart01;

  return FileAttachment02;
};

export const AttachmentsList: FC<{
  attachments?: ResourceFileDeepsDTO[];
  isLoading: boolean;
}> = ({ attachments = [], isLoading }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState<PreviewContent>({
    src: '',
    type: 'other',
  });

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (isLoading) {
    return (
      <Flex gap={24} justify="stretch" style={{ marginTop: 80 }}>
        <SkeletonNode active />
        <SkeletonNode active />
      </Flex>
    );
  }

  if (!attachments?.length) {
    return null;
  }
  const handleDownload = (attachmentId: string | undefined) => {
    if (attachmentId) {
      const url = `${DIRECTUS_ASSETS_URL}${attachmentId}`;
      window.open(url, '_blank');
    }
  };

  const handleDownloadAll = () => {
    attachments.forEach((attachment) => {
      if (attachment.assetId) {
        handleDownload(attachment?.assetId?.id);
      }
    });
  };

  const handlePreview = (attachment: ResourceFileDeepsDTO['assetId']) => {
    if (attachment?.id && attachment?.file?.type) {
      const url = `${DIRECTUS_ASSETS_URL}${attachment?.file?.filenameDisk || attachment?.image?.filenameDisk}`;

      const previewTypes: Record<string, FileType> = {
        'image/': 'image',
        'audio/': 'audio',
        'video/': 'video',
        'application/pdf': 'application/pdf',
      };

      for (const [key, type] of Object.entries(previewTypes)) {
        if (attachment?.file?.type?.startsWith(key)) {
          setPreviewContent({ src: url, type });
          setPreviewVisible(true);
          return;
        }
      }

      handleDownload(attachment?.id);
    }
  };

  const renderPreviewContent = () => {
    const contentMap: Record<FileType, JSX.Element | null> = {
      image: (
        <img
          alt="preview"
          style={{ width: '100%', borderRadius: 8, maxHeight: '90vh' }}
          src={previewContent.src}
        />
      ),
      audio: (
        <audio controls style={{ width: '100%' }}>
          <source src={previewContent.src} />
        </audio>
      ),
      video: (
        <video
          controls
          style={{ width: '100%', borderRadius: 8, maxHeight: '90vh' }}
        >
          <source src={previewContent.src} />
        </video>
      ),
      'application/pdf': (
        <Flex style={{ maxHeight: '80vh' }} vertical>
          <OverlayScrollbarsComponent
            element="div"
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            <StyledDocument
              key={previewContent?.src}
              file={previewContent?.src}
              onLoadSuccess={onDocumentLoadSuccess}
              options={documentOptions}
            >
              <Page pageNumber={pageNumber} width={700} />
            </StyledDocument>
          </OverlayScrollbarsComponent>
          {(numPages || 0) > 1 && (
            <PdfPaginationWrapper alignment="center" fill>
              <Pagination
                align="center"
                pageSize={1}
                current={pageNumber}
                total={numPages}
                onChange={setPageNumber}
              />
            </PdfPaginationWrapper>
          )}
        </Flex>
      ),
      text: <div>text</div>,

      other: null,
    };

    return contentMap[previewContent.type];
  };

  return (
    <Stack vertical style={{ marginTop: 20 }}>
      <Stack alignment="center">
        <Text strong>Attachments</Text>
        {attachments.length > 1 && (
          <Button
            type="link"
            onClick={handleDownloadAll}
            disabled={attachments.length === 0}
          >
            Download all
          </Button>
        )}
      </Stack>
      <Row gutter={[8, 8]}>
        {attachments?.map((item) => {
          const file = item.assetId;

          const FileIcon = getFileIcon(
            item?.assetId?.file?.type as string,
            item?.assetId?.file?.filenameDisk as string
          );

          return (
            <Col xxl={6} xs={12} sm={12} xl={6} md={12} key={file?.id}>
              <AttachmentButton
                block
                type="primary"
                icon={<FileIcon />}
                onClick={() => file && handlePreview(file)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  height: 'auto',
                  whiteSpace: 'normal',
                }}
              >
                <Text style={{ color: 'white' }} ellipsis>
                  {file?.name}
                </Text>
              </AttachmentButton>
            </Col>
          );
        })}
      </Row>
      <Modal
        destroyOnClose
        centered
        transitionName="ant-fade"
        open={previewVisible}
        title="Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {renderPreviewContent()}
      </Modal>
    </Stack>
  );
};
