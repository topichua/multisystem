import { useRef } from 'react';
import { observer } from 'mobx-react';
import { Empty } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Comment } from 'src/transport/posts/posts.dto';
import { CommentInput } from 'src/components/common/CommentInput/CommentInput';
import { UserProfileDto } from 'src/transport/account/account.dto';
import { UploadAttachments } from 'src/components/common/UploadAttachments/UploadAttachments';
import { CommunityRole } from 'src/transport/communities/communities.dto';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

import { CommentsList } from '../comments-list/comments-list';
import { PostActions } from '../post-actions/post-actions';
import { useCommentService } from '../../__hooks/useCommentService';
import { useCommunityPostDetailsStore } from '../../community-post-details.provider';

import * as S from './post-comments.styled';

type PostCommentsProps = {
  comments: Comment[];
  userRole: CommunityRole | null;
  isPostClosed: boolean;
  currentUser?: UserProfileDto;
  createdByUserId?: string;
};

export const PostComments = observer(
  ({
    comments,
    createdByUserId,
    userRole,
    isPostClosed,
  }: PostCommentsProps) => {
    const commentInputRef = useRef<any>(null);

    const { commentsCount, permissions } = useCommunityPostDetailsStore();
    const {
      comment,
      isSaveLoading,
      attachments,
      setAttachments,
      setComment,
      saveComment,
      replyInputId,
      setReplyInputId,
    } = useCommentService({ id: null, type: 'create' });
    const { user: currentUser, globalPermission } = useCurrentUserStore();

    const handleSaveComment = () => {
      saveComment().then(() => {
        commentInputRef?.current?.clear();
      });
    };

    const canCreateComment =
      permissions?.commentCreate || globalPermission?.commentCreate;

    return (
      <Stack vertical spacing="extraLoose">
        <PostActions />

        <S.CounterText>{commentsCount} comments</S.CounterText>

        {!isPostClosed && canCreateComment && (
          <CommentInput
            ref={commentInputRef}
            comment={comment}
            isLoading={isSaveLoading}
            footer={
              <UploadAttachments
                files={attachments}
                note="max 10 files of any of the types: pdf, docx, xlsx, ppt, pptx, txt, png, jpeg, jpg. Max file size 5Mb."
                onChange={setAttachments}
              />
            }
            currentUser={currentUser || undefined}
            onChangeComment={setComment}
            onSave={handleSaveComment}
          />
        )}

        {comments.length === 0 ? (
          <Empty description="No comments yet" />
        ) : (
          <CommentsList
            comments={comments}
            level={1}
            createdByUserId={createdByUserId}
            currentUser={currentUser || undefined}
            setReplyInputId={setReplyInputId}
            replyInputId={replyInputId}
            userRole={userRole}
          />
        )}
      </Stack>
    );
  }
);
