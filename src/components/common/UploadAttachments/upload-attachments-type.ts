import { UploadFile } from 'antd/es/upload';

export enum ActionStatusEnum {
  Added = 1,
  Deleted = 2,
}

export type UploadAttachment = UploadFile & {
  actionStatus?: ActionStatusEnum;
};

export type UploadAttachmentsProps = {
  label?: string;
  note?: string;
  files: UploadAttachment[];
  onChange: (files: UploadAttachment[]) => void;
  maxFileLength?: number;
};
