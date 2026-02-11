import { Button } from 'antd';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import file1 from 'src/assets/profile/OTA_Member_Logo_Branding_Guidelines_member_services_2024.pdf';
import file2 from 'src/assets/profile/OTA_Member_Logo_Terms_and_Conditions_member_services_2024.pdf';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import DocumentView from 'src/pages/settings/membership-profile/logos_docs_images/document-view.tsx';
import DocumentPagination from 'src/pages/settings/membership-profile/logos_docs_images/document-pagination.tsx';
import * as S from './profile.styles.ts';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const downloadPdf = (file: string) => {
    const cleanPath = file.split('?')[0];
    const fileName = cleanPath.split('/').pop() + '';

    const link = document.createElement('a');
    link.href = file || '';
    link.download = fileName;
    link.title = fileName;
    link.click();
  };

  return (
    <>
      <S.StyledModal
        title="PDF Viewer"
        open={!!file}
        width={860}
        centered
        onCancel={() => setFile(null)}
        footer={[
          <Stack alignment="baseline" distribution="equalSpacing">
            <DocumentPagination
              pageNumber={pageNumber}
              numPages={numPages}
              onPageChange={setPageNumber}
            />
            <Stack>
              <Button
                key="download"
                type="primary"
                onClick={() => downloadPdf(file || '')}
              >
                Download PDF
              </Button>
              <Button key="close" onClick={() => setFile(null)}>
                Close
              </Button>
            </Stack>
          </Stack>,
        ]}
      >
        <Stack>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} width={795} />
          </Document>
        </Stack>
      </S.StyledModal>
      <Divider />
      <DocumentView
        title="OTA Member Logo Terms and Conditions"
        file={file2}
        setFile={setFile}
        handleDownload={downloadPdf}
      />
      <Divider />
      <DocumentView
        title="OTA Member Logo Branding Guidelines"
        file={file1}
        setFile={setFile}
        handleDownload={downloadPdf}
      />
    </>
  );
};

export default PdfViewer;
