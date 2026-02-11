import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Empty, Spin } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';

import { useCommunityManagementStore } from '../admin-community.provider';
import { CommunityQuestionItem } from '../__components/community-question-item/community-question-item';
import {
  AddQuestionModal,
  QuestionDtoValues,
} from '../__components/add-question-modal/add-question-modal';
import { useQuestion } from '../admin-community-membership-requirements/useQuestion';

export const AdminCommunityJoinQuestions = observer(() => {
  const {
    communityId,
    community,
    questions,
    isQuestionsLoading,
    loadQuestions,
  } = useCommunityManagementStore();

  const canManageQuestions = !community?.isPublic && community?.isVisible;

  const {
    selectedQuestionToEdit,
    isQuestionMutateLoading,
    selectedQuestionToDelete,
    deleteQuestion,
    setSelectedQuestionToDelete,
    setSelectedQuestionToEdit,
    mutateQuestion,
  } = useQuestion();

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleEditQuestion = (updatedQuestion: QuestionDtoValues) => {
    mutateQuestion(communityId, updatedQuestion).then(() => {
      setSelectedQuestionToEdit(null);
      loadQuestions();
    });
  };

  const handleDeleteQuestion = () => {
    if (!selectedQuestionToDelete?.id) return;

    deleteQuestion(communityId, selectedQuestionToDelete?.id).then(() => {
      setSelectedQuestionToDelete(null);
      loadQuestions();
    });
  };

  return (
    <>
      {canManageQuestions ? (
        <Spin spinning={isQuestionsLoading}>
          {!isQuestionsLoading && questions.length === 0 && <Empty />}

          <Stack vertical>
            {questions.map((question, index) => (
              <CommunityQuestionItem
                key={question.id}
                index={index}
                question={question}
                onDelete={() => setSelectedQuestionToDelete(question)}
                onEdit={() => setSelectedQuestionToEdit(question)}
              />
            ))}
          </Stack>
        </Spin>
      ) : (
        <Alert type="warning" message="Community must be private and visible" />
      )}

      <AddQuestionModal
        open={!!selectedQuestionToEdit}
        okButtonProps={{ loading: isQuestionMutateLoading }}
        question={selectedQuestionToEdit || undefined}
        onMutateQuestion={handleEditQuestion}
        onCancel={() => setSelectedQuestionToEdit(null)}
      />

      <ConfirmModal
        isOpen={!!selectedQuestionToDelete}
        confirmButtonProps={{ danger: true }}
        confirmButtonText="Delete"
        title={`Are you sure you want to delete ${selectedQuestionToDelete?.text} question?`}
        isLoading={isQuestionMutateLoading}
        onClose={() => setSelectedQuestionToDelete(null)}
        onConfirm={handleDeleteQuestion}
      />
    </>
  );
});
