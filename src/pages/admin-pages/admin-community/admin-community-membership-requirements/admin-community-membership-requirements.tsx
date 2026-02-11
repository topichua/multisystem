import { FileCheck02 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { Outlet, useNavigate } from 'react-router-dom';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Tabs } from 'src/components/common/Tabs/Tabs';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';

import { useCommunityManagementStore } from '../admin-community.provider';

import {
  AddQuestionModal,
  QuestionDtoValues,
} from '../__components/add-question-modal/add-question-modal';

import { useQuestion } from './useQuestion';
import { Tooltip } from 'antd';

export const AdminCommunityMembershipRequirements = observer(() => {
  const navigate = useNavigate();
  const { communityId, community, loadQuestions } =
    useCommunityManagementStore();

  const canManageQuestions = !community?.isPublic && community?.isVisible;

  const {
    isOpenModal,
    isQuestionMutateLoading,
    mutateQuestion,
    openModal: openQuestionModal,
    closeModal: closeQuestionModal,
  } = useQuestion();

  const handleMutateQuestion = (question: QuestionDtoValues) => {
    mutateQuestion(communityId, question).then(() => {
      loadQuestions();
    });
  };

  const isJoinQuestionsPage = location?.pathname.includes('join-questions');

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<FileCheck02 />}
          title="Membership requirements"
        />
        <InnerPageHeader fillChildren>
          <Stack alignment="center" distribution="equalSpacing">
            <Tabs
              size="small"
              items={[
                {
                  label: 'Terms and Conditions',
                  key: `/admin/community/${communityId}/membership-requirements`,
                },
                {
                  label: 'Join questions',
                  key: `/admin/community/${communityId}/membership-requirements/join-questions`,
                },
              ]}
              activeKey={location?.pathname}
              onChange={(key) => navigate(key)}
            />
            {isJoinQuestionsPage && (
              <Tooltip
                title={
                  !canManageQuestions
                    ? 'Community must be private and visible'
                    : undefined
                }
              >
                <Button
                  type="primary"
                  disabled={!canManageQuestions}
                  onClick={openQuestionModal}
                >
                  Add question
                </Button>
              </Tooltip>
            )}
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>

      <Page.Content>
        <Outlet />
      </Page.Content>

      <AddQuestionModal
        open={isOpenModal}
        okButtonProps={{ loading: isQuestionMutateLoading }}
        onMutateQuestion={handleMutateQuestion}
        onCancel={closeQuestionModal}
      />
    </>
  );
});
