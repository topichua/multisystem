import { ReactNode, useEffect, useState } from 'react';

import { InputTextArea } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';

type ReportModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  title?: ReactNode;
  onClose: () => void;
  onReport: (report: string) => void;
};

export const ReportModal = ({
  isOpen,
  isLoading = false,
  title = 'Would you like to report this comment?',
  onClose,
  onReport,
}: ReportModalProps) => {
  const [report, setReport] = useState('');

  useEffect(() => {
    if (!isOpen) setReport('');
  }, [isOpen]);

  const isDisableReportButton = report.trim().length === 0;

  return (
    <Modal
      open={isOpen}
      title={title}
      okText="Submit Report"
      okButtonProps={{ loading: isLoading, disabled: isDisableReportButton }}
      cancelButtonProps={{ disabled: isLoading }}
      onCancel={onClose}
      onOk={() => onReport(report)}
    >
      <InputTextArea
        value={report}
        placeholder="Type report"
        style={{ height: 100 }}
        onChange={(e) => setReport(e.target.value)}
      />
    </Modal>
  );
};
