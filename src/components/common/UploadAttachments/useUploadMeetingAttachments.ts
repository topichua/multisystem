import { UploadFile, UploadProps } from 'antd/es/upload';
import { notification } from 'antd';
import { differenceBy } from 'lodash';
import {
  ActionStatusEnum,
  UploadAttachment,
} from './upload-attachments-type.ts';

const MAX_FILE_SIZE = 5; // size in mb

export const useUploadMeetingAttachments = (
  files: UploadAttachment[],
  onChange?: (files: UploadAttachment[]) => void
) => {
  const beforeUploadFilesCheck = (newFiles: UploadFile[]) => {
    const maxSize = MAX_FILE_SIZE * 1024 * 1024;
    const allowedExtensions = [
      'pdf',
      'docx',
      'xlsx',
      'txt',
      'png',
      'jpeg',
      'jpg',
      'pptx',
      'ppt',
    ];

    return newFiles.every((file) => {
      const extension = file?.name?.split('.')?.pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        notification.error({
          message: `Allowed only: ${allowedExtensions.join(', ')} file types`,
        });
        return false;
      }

      if (file.size && file?.size > maxSize) {
        notification.error({
          message: `Maximum allowed file size is 5Mb`,
        });
        return false;
      }

      return true;
    });
  };

  const onPreview = async (file: UploadFile) => {
    const allowedPreviewExtensions = ['png', 'jpeg', 'jpg'];

    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    if (!extension || !allowedPreviewExtensions.includes(extension)) {
      notification.error({
        message: `Allowed only: ${allowedPreviewExtensions.join(', ')} file types for preview`,
      });
      return false;
    }

    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as any);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onChangeFiles: UploadProps['onChange'] = ({ fileList }) => {
    const isValid = beforeUploadFilesCheck(fileList);
    if (!isValid) return;
    const newFiles = differenceBy(fileList, files, 'uid');

    if (!onChange) return false;
    return onChange([
      ...files,
      ...newFiles.map((f) => ({
        ...f,
        actionStatus: ActionStatusEnum.Added,
      })),
    ]);
  };

  const handleDelete = (file: UploadAttachment) => {
    if (!onChange) return false;
    if (file.actionStatus === ActionStatusEnum.Added) {
      onChange(files.filter((f) => f.uid !== file.uid));
    }
    if (!file.actionStatus) {
      onChange(
        files.map((f) => ({
          ...f,
          actionStatus:
            f.uid === file.uid ? ActionStatusEnum.Deleted : f.actionStatus,
        }))
      );
    }

    return false;
  };

  const filteredFiles = files.filter(
    (f) => f.actionStatus !== ActionStatusEnum.Deleted
  );

  return {
    onPreview,
    onChangeFiles,
    handleDelete,
    filteredFiles,
    beforeUploadFilesCheck,
  };
};
