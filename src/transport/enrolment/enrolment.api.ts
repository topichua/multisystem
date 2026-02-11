import axiosInstance from '../axios/axios-bond-instance';

import { EnrolmentStatus, GetEnrolmentListResponse } from './enrolment.dto';

export const enrolmentApi = {
  getEnrolmentList: async (
    userId: string,
    status: EnrolmentStatus | null = null
  ): Promise<GetEnrolmentListResponse> => {
    return await axiosInstance.post(`/api/user/enrolment/list`, {
      userId,
      status,
    });
  },
  unenrol: async (userId: string, courseId: number, courseCode: string) => {
    return await axiosInstance.post(`/api/user/enrolment/unenrol`, {
      userId,
      courseId,
      courseCode,
    });
  },
};
