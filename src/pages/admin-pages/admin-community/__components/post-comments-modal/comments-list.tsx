import { Collapse, Typography } from 'antd';
import { useEffect, useRef } from 'react';

import { Comment } from 'src/transport/posts/posts.dto';
import { CommentItem } from 'src/components/common/CommentItem/CommentItem';
import { Stack } from 'src/components/common/Stack/Stack';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { AttachmentsList } from 'src/pages/community-pages/community-post-details/__components/attachments-list/attachments-list';
import { formatCommentCreatedAt } from 'src/pages/community-pages/community-post-details/__components/comment-item/comment-item';

import * as S from './post-comments-modal.styled';

const { Text } = Typography;

type CommentsListProps = {
  comments: Comment[];
  reportedCommentId?: string;
  noPadding?: boolean;
};

export const CommentsList = ({
  comments,
  reportedCommentId,
  noPadding = false,
}: CommentsListProps) => {
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentRef.current && comments) {
      commentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  return (
    <S.CommentsList noPadding={noPadding}>
      <Stack vertical spacing="normal">
        {comments.map((comment) => {
          const hasChildComments =
            comment.comments && comment.comments.length > 0;

          return (
            <Stack vertical key={comment.id}>
              <div ref={reportedCommentId === comment.id ? commentRef : null}>
                <CommentItem
                  createdAt={
                    <Text type="secondary">
                      {formatCommentCreatedAt(
                        comment.createdAt,
                        comment.updatedAt
                      )}
                    </Text>
                  }
                  body={
                    <Stack vertical spacing="tight">
                      <div dangerouslySetInnerHTML={{ __html: comment.body }} />
                      {comment?.attachments &&
                        comment?.attachments?.length > 0 && (
                          <Collapse
                            items={[
                              {
                                key: '1',
                                label: 'Attachments',
                                children: (
                                  <AttachmentsList
                                    attachments={comment.attachments}
                                    ellipsis={false}
                                    label={null}
                                  />
                                ),
                              },
                            ]}
                            size="small"
                          />
                        )}
                    </Stack>
                  }
                  userName={`${comment?.user?.firstName} ${comment?.user?.lastName}`}
                  isReported={reportedCommentId === comment.id}
                  avatar={
                    <UserAvatar
                      shape="circle"
                      firstName={comment?.user?.firstName || ''}
                      lastName={comment?.user?.lastName || ''}
                      src={comment?.user?.avatarUrl}
                    />
                  }
                />
              </div>
              {hasChildComments ? (
                <CommentsList
                  comments={comment.comments as Comment[]}
                  reportedCommentId={reportedCommentId}
                />
              ) : null}
            </Stack>
          );
        })}
      </Stack>
    </S.CommentsList>
  );
};
