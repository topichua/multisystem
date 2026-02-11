import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useState } from 'react';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunityQuestion,
  EditQuestionDto,
} from 'src/transport/communities/communities.dto';

type QuestionValues = {
  id?: string;
  text: string;
  isRequiredAssets: boolean;
};

export const useQuestion = () => {
  const [isOpenModal, { setTrue: openModal, setFalse: closeModal }] =
    useBoolean(false);

  const [selectedQuestionToEdit, setSelectedQuestionToEdit] =
    useState<CommunityQuestion | null>(null);
  const [selectedQuestionToDelete, setSelectedQuestionToDelete] =
    useState<CommunityQuestion | null>(null);

  const [
    isQuestionMutateLoading,
    { setTrue: startLoading, setFalse: finishLoading },
  ] = useBoolean(false);

  const mutateQuestion = async (
    communityId: string,
    question: QuestionValues
  ) => {
    startLoading();
    if (question.id) {
      return communityApi
        .editQuestion(communityId, question as EditQuestionDto)
        .then(() => {
          closeModal();
          notification.success({ message: `Question edited successfully` });
        })
        .catch(() => {
          notification.error({ message: `Question edited error. Try again` });
        })
        .finally(finishLoading);
    } else {
      // create question
      return communityApi
        .createQuestion(communityId, question)
        .then(() => {
          closeModal();
          notification.success({ message: `Question added successfully` });
        })
        .catch(() => {
          notification.error({ message: `Question added error. Try again` });
        })
        .finally(finishLoading);
    }
  };

  const deleteQuestion = (communityId: string, questionId: string) => {
    startLoading();

    return communityApi
      .deleteQuestion(communityId, questionId)
      .then(() => {
        notification.success({ message: `Question deleted successfully` });
      })
      .catch(() => {
        notification.error({ message: `Question deleted error. Try again` });
      })
      .finally(finishLoading);
  };

  return {
    isOpenModal,
    isQuestionMutateLoading,
    selectedQuestionToEdit,
    selectedQuestionToDelete,
    deleteQuestion,
    setSelectedQuestionToDelete,
    setSelectedQuestionToEdit,
    openModal,
    closeModal,
    mutateQuestion,
  };
};
