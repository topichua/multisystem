import { notification } from 'antd';

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notification.success({
          message: 'Copied successfully!',
        });
      })
      .catch((err) => {
        notification.error({
          message: 'Failed to copy text!',
          description: err.message,
        });
      });
  } else {
    notification.error({
      message: 'Clipboard API is not supported or requires user interaction.',
    });
  }
};
