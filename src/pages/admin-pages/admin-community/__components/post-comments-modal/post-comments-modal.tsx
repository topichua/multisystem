import { ReactNode } from 'react';
import { Skeleton } from 'antd';
import { Comment } from 'src/transport/posts/posts.dto';

import { CommentsList } from './comments-list';
import { useComments } from './useComments';

import * as S from './post-comments-modal.styled';

type PostCommentsModalProps = {
  reportedComment: Comment | null;
  footer: ReactNode;
  onClose: () => void;
};

export const PostCommentsModal = ({
  reportedComment,
  footer,
  onClose,
}: PostCommentsModalProps) => {
  const { comments, isLoading } = useComments(reportedComment?.postId || null);

  return (
    <S.Modal
      width={1000}
      open={!!reportedComment}
      footer={footer}
      destroyOnClose
      title="Review comment by user"
      onCancel={onClose}
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <CommentsList
          comments={comments}
          reportedCommentId={reportedComment?.id}
          noPadding
        />
      )}
    </S.Modal>
  );
};
