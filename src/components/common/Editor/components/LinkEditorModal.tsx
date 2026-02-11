import { Input, Modal, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaviconComponent } from './FaviconComponent';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, url: string) => void;
  initialText: string;
  initialUrl: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText,
  initialUrl,
}) => {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);

  const clearLinkState = useCallback(() => {
    setText('');
    setUrl('');
  }, []);

  const handleSave = useCallback(() => {
    onSave(text, url);
    clearLinkState();
  }, [text, url, onSave, clearLinkState]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setUrl(initialUrl);
    }
  }, [isOpen, initialText, initialUrl]);

  const isButtonDisabled = useMemo(() => {
    return !url?.trim()?.length || !text?.trim()?.length;
  }, [url, text]);

  return (
    <Modal
      title="Insert/Edit Link"
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleSave}
      okText="Save"
      destroyOnClose
      centered
      okButtonProps={{
        disabled: isButtonDisabled,
      }}
    >
      <Typography.Text strong>Text</Typography.Text>
      <Input
        placeholder="Link text"
        value={text}
        onChange={handleTextChange}
        style={{ marginBottom: 16 }}
      />

      <Typography.Text strong>Link</Typography.Text>
      <Input
        placeholder="URL"
        value={url}
        onChange={handleUrlChange}
        prefix={<FaviconComponent url={url} />}
      />
    </Modal>
  );
};
