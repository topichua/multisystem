import React from 'react';
import { Button } from 'antd';

interface PaginationProps {
  pageNumber: number;
  numPages: number | null;
  onPageChange: (page: number) => void;
}

const DocumentPagination: React.FC<PaginationProps> = ({
  pageNumber,
  numPages,
  onPageChange,
}) => {
  return (
    <div style={{ marginTop: 10, textAlign: 'center' }}>
      <Button
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber <= 1}
        style={{ marginRight: 10 }}
      >
        Previous
      </Button>
      <span>
        Page {pageNumber} of {numPages || '...'}
      </span>
      <Button
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber >= (numPages || 1)}
        style={{ marginLeft: 10 }}
      >
        Next
      </Button>
    </div>
  );
};

export default DocumentPagination;
