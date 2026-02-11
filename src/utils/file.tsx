import { FileTextFilled } from '@ant-design/icons';
import { ReactNode } from 'react';

import CsvIcon from 'src/assets/assets-icons/csv.svg?react';
import DocxIcon from 'src/assets/assets-icons/docx.svg?react';
import Image from 'src/assets/assets-icons/Image.svg?react';
import LinkIcon from 'src/assets/assets-icons/link.svg?react';
import Mp4Icon from 'src/assets/assets-icons/mp4.svg?react';
import PdfIcon from 'src/assets/assets-icons/pdf.svg?react';
import PptxIcon from 'src/assets/assets-icons/pptx.svg?react';
import DefaultIcon from 'src/assets/assets-icons/unidentified.svg?react';
import XlsxIcon from 'src/assets/assets-icons/xlsx.svg?react';

export const downloadFile = (
  fileBuffer: ArrayBuffer,
  fileName: string,
  fileType = 'application/pdf'
) => {
  const fileBlob = new Blob([fileBuffer], { type: fileType });
  const fileURL = window.URL.createObjectURL(fileBlob);

  const link = document.createElement('a');
  link.href = fileURL;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

export const fileTypeIcons: { [key: string]: ReactNode } = {
  csv: <CsvIcon />,
  docx: <DocxIcon />,
  link: <LinkIcon />,
  mp4: <Mp4Icon />,
  pdf: <PdfIcon />,
  pptx: <PptxIcon />,
  ppt: <PptxIcon />,
  xlsx: <XlsxIcon />,
  txt: <FileTextFilled />,
  png: <Image height={40} width={40} />,
  jpeg: <Image height={40} width={40} />,
  jpg: <Image height={40} width={40} />,
  default: <DefaultIcon height={40} width={40} />,
};
