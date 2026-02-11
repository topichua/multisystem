import { UploadFile } from 'antd/es/upload/interface';
import { UploadAttachment } from 'src/components/common/UploadAttachments/UploadAttachments.tsx';

export type CreateMeetingForm = {
  id?: string;
  name: string;
  description: string;
  meetingLink: string;
  meetingId?: string;
  meetingPassword?: string;
  sendNotification: boolean;
  startDate: Date;
  startDateFrom: Date;
  startDateTo: Date;
  rsvpDate: Date;
  assets?: UploadAttachment[];
  visible: string;
  imageFile?: UploadFile;
};
