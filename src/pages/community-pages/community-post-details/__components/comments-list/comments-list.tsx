import { observer } from 'mobx-react';
import { Dispatch, SetStateAction } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Comment } from 'src/transport/posts/posts.dto';
import { UserProfileDto } from 'src/transport/account/account.dto';
import { CommunityRole } from 'src/transport/communities/communities.dto';

import { CommentItem } from '../comment-item/comment-item';
import { useCommunityPostDetailsStore } from '../../community-post-details.provider';

import * as S from './comments-list.styled';

export const MAX_REPLY_LEVEL = 3;

export type CommentsListProps = {
  comments: Comment[];
  hasPadding?: boolean;
  currentUser?: UserProfileDto;
  createdByUserId?: string;
  replyInputId: string | null;
  setReplyInputId: Dispatch<SetStateAction<string | null>>;
  userRole: CommunityRole | null;
  level: number;
};

export const CommentsList = observer(
  ({
    hasPadding = false,
    comments,
    currentUser,
    createdByUserId,
    replyInputId,
    setReplyInputId,
    userRole,
    level,
  }: CommentsListProps) => {
    const { comments: commentsFromStore, commentsUsers } =
      useCommunityPostDetailsStore();

    return (
      <S.List hasPadding={hasPadding}>
        <Stack vertical spacing="loose">
          {comments.map((comment) => {
            const childrenComments = commentsFromStore?.[comment.id];

            return (
              <Stack key={comment.id} vertical spacing="loose">
                <CommentItem
                  comment={comment}
                  user={commentsUsers[comment.createdByUserId]}
                  currentUser={currentUser}
                  userRole={userRole}
                  createdByUserId={createdByUserId}
                  replyInputId={replyInputId}
                  canReply={level < MAX_REPLY_LEVEL}
                  setReplyInputId={setReplyInputId}
                />
                {childrenComments && childrenComments.length > 0 && (
                  <CommentsList
                    comments={childrenComments}
                    currentUser={currentUser}
                    createdByUserId={createdByUserId}
                    hasPadding
                    userRole={userRole}
                    replyInputId={replyInputId}
                    level={level + 1}
                    setReplyInputId={setReplyInputId}
                  />
                )}
              </Stack>
            );
          })}
        </Stack>
      </S.List>
    );
  }
);
