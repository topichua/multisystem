import { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { notification } from 'antd';

import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { enrolmentApi } from 'src/transport/enrolment/enrolment.api';
import {
  Enrolment,
  EnrolmentStatus,
} from 'src/transport/enrolment/enrolment.dto';

export const useEnrolments = (status: EnrolmentStatus | null = null) => {
  const { user } = useCurrentUserStore();

  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  useEffect(() => {
    fetchEnrolment();
  }, []);

  const fetchEnrolment = () => {
    if (!user?.id) return;

    startLoading();

    enrolmentApi
      .getEnrolmentList(user.id, status)
      .then(({ data }) => {
        setEnrolments(data.enrolments);
      })
      .catch(() => {
        notification.error({ message: 'Failed to get enrolls' });
      })
      .finally(finishLoading);
  };

  const unenrolment = async (enrolment: Enrolment) => {
    if (!user?.id) return;

    enrolmentApi
      .unenrol(user.id, enrolment.course.courseId, enrolment.courseCode)
      .then(() => {
        notification.success({ message: 'Unenroll success' });
        fetchEnrolment();
      })
      .catch(() => {
        notification.error({ message: 'Failed unenroll course' });
      });
  };

  return { enrolments, isLoading, fetchEnrolment, unenrolment };
};
