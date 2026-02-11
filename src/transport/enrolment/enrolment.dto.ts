export type EnrolmentStatus = 'Active' | 'Completed';

export type Course = {
  courseId: number;
  courseName: string;
  displayName: string;
  shortName: string;
  categoryId: number;
  categoryName: string;
};

export type Enrolment = {
  modelUserID: number;
  modelCourseID: number;
  courseCode: string;
  course: Course;
  isPaid: boolean;
  userId: string;
  memberNumber: string;
  enrolmentId: string;
  enrolmentDate: Date;
  expiryDate: Date;
  lastSyncedDate: Date;
  completionDate: Date | null;
  status: EnrolmentStatus;
  statusMessage: string | null;
  loginUrl: string | null;
};

export type GetEnrolmentListResponse = {
  data: {
    enrolments: Enrolment[];
    page: number;
    size: number;
    totalItems: number;
  };
};
