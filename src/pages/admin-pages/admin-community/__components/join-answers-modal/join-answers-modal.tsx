import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  CollapseProps,
  Empty,
  ModalProps,
  Skeleton,
  Typography,
  notification,
} from 'antd';
import { useBoolean } from 'ahooks';

import { Modal } from 'src/components/common/Modal/Modal';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  AnswerDto,
  CommunityMember,
} from 'src/transport/communities/communities.dto';
import { Stack } from 'src/components/common/Stack/Stack';
import { AttachmentsList } from 'src/pages/community-pages/community-post-details/__components/attachments-list/attachments-list';

import { useCommunityManagementStore } from '../../admin-community.provider';

import * as S from './join-answers-modal.styled';

const { Text } = Typography;

type JoinAnswersModalProps = ModalProps & {
  member: CommunityMember | null;
};

export const JoinAnswersModal = observer(
  ({ member, ...rest }: JoinAnswersModalProps) => {
    const { communityId } = useCommunityManagementStore();

    const [
      isLoadingAnswers,
      { setTrue: startLoadingAnswers, setFalse: finishLoadingAnswers },
    ] = useBoolean(false);
    const [answers, setAnswers] = useState<AnswerDto[]>([]);

    useEffect(() => {
      fetchMember();
    }, [member]);

    const fetchMember = () => {
      if (!member) return;

      startLoadingAnswers();

      communityApi
        .getCommunityMemberAnswers({ communityId, memberId: member.id })
        .then((res) => {
          setAnswers(res.questionAnswers);
        })
        .catch(() => {
          notification.error({ message: 'Failed to load member questions' });
        })
        .finally(finishLoadingAnswers);
    };

    const collapseItems: CollapseProps['items'] = answers.map((answer) => ({
      key: `${answer.questionText}-${answer.answerText}`,
      label: answer.questionText,
      children: (
        <Stack vertical spacing="tight">
          {answer.answerText && <Text>{answer.answerText}</Text>}
          {answer.attachments.length > 0 && (
            <AttachmentsList label={null} attachments={answer.attachments} />
          )}
        </Stack>
      ),
    }));

    return (
      <Modal title="Join answers" {...rest}>
        {!isLoadingAnswers && answers.length === 0 && (
          <Empty description="Member has no answers" />
        )}
        {isLoadingAnswers ? (
          <Skeleton active />
        ) : (
          <S.Collapse
            items={collapseItems}
            defaultActiveKey={collapseItems[0]?.key as string}
            expandIconPosition="end"
            bordered={false}
          />
        )}
      </Modal>
    );
  }
);
