import { Download01, Eye } from '@untitled-ui/icons-react';
import { Button } from 'antd';
import { Document, Page } from 'react-pdf';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';

type DocumentViewProps = {
  title: string;
  file: string;
  setFile: (file: string) => void;
  handleDownload: (file: string) => void;
};

const DocumentView = ({
  title,
  file,
  setFile,
  handleDownload,
}: DocumentViewProps) => (
  <Stack vertical alignment="leading">
    <Title level={3}>{title}</Title>
    <Stack alignment="center">
      <Document file={file} onClick={() => setFile(file)}>
        <Page width={420} pageNumber={1} />
      </Document>
      <Stack>
        <Button onClick={() => setFile(file)} icon={<Eye />}>
          Preview
        </Button>
        <Button onClick={() => handleDownload(file)} icon={<Download01 />}>
          Download
        </Button>
      </Stack>
    </Stack>
  </Stack>
);

export default DocumentView;
