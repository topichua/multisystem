interface AttachmentDTO {
  id: string;
  name: string;
  url: string;
}

export interface CpdRecordDTO {
  cpdId: string; // UUID format
  title: string;
  categoryName: string;
  presenter: string;
  domain: string;
  hours: number;
  description: string;
  completedDate: string; // ISO 8601 date format
  attachments: AttachmentDTO[];
  relatedEventId: string; // UUID format
  editUrl: string;
}

export interface PeriodDTO {
  cpdPeriodId: string; // UUID format
  cpdPeriod: string;
  periodStartDate: string; // ISO 8601 date format
  periodEndDate: string; // ISO 8601 date format
  completedTotalHours: number;
  minimumRequiredHours: number;
  cpdRecords: CpdRecordDTO[];
}

interface UserData {
  userId: string;
  periods: PeriodDTO[];
}

export interface UserCpdResponse {
  data: UserData;
  message: string;
}

export interface CpdCertificateData {
  previewUrl: string;
  previewHtml: string;
  printUrl: string;
}

export interface CpdCertificateResponse {
  data: CpdCertificateData;
  message: string;
}

export interface GetCreateCPDEntityUrlResponse {
  data: string;
  message: string;
}
