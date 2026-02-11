import { Collapse } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CommentInput } from 'src/components/common/CommentInput/CommentInput';
import { CommentItem as CommonCommentItem } from 'src/components/common/CommentItem/CommentItem';

import { Stack } from 'src/components/common/Stack/Stack';
import { UploadAttachments } from 'src/components/common/UploadAttachments/UploadAttachments';

import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { UserProfileDto } from 'src/transport/account/account.dto';
import { CommunityRole } from 'src/transport/communities/communities.dto';
import { Comment } from 'src/transport/posts/posts.dto';
import { getCalendarDateTime } from 'src/utils/date-time';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

import { useCommentService } from '../../__hooks/useCommentService';
import { useToggleLikeOrSave } from '../../__hooks/useToggleLikeOrSave';
import { AttachmentsList } from '../attachments-list/attachments-list';
import { CommentDropdown } from '../comment-dropdown/comment-dropdown';
import { useCommunityPostDetailsStore } from '../../community-post-details.provider';

import { OriginalPosterLabel } from '../original-poster-label';

import * as S from './comment-item.styled';

type CommentItemProps = {
  comment: Comment;
  user?: UserProfileDto;
  currentUser?: UserProfileDto;
  createdByUserId?: string;
  replyInputId: string | null;
  setReplyInputId: Dispatch<SetStateAction<string | null>>;
  userRole: CommunityRole | null;
  canReply?: boolean;
};

export const formatCommentCreatedAt = (createdAt: Date, updatedAt: Date) => {
  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);

  if (updatedDate.valueOf() - createdDate.valueOf() > 100) {
    return `${getCalendarDateTime(createdAt)} (edited: ${getCalendarDateTime(updatedAt)})`;
  }
  return getCalendarDateTime(createdAt);
};

export const CommentItem = observer(
  ({
    comment,
    user,
    currentUser,
    createdByUserId,
    replyInputId,
    canReply = true,
    setReplyInputId,
  }: CommentItemProps) => {
    const replyInputRef = useRef<any>(null);

    const { permissions } = useCommunityPostDetailsStore();
    const { globalPermission } = useCurrentUserStore();

    const {
      comment: commentInput,
      isShowCommentInput,
      isSaveLoading,
      attachments: replyCommentAttachments,
      setAttachments: setReplyCommentAttachments,
      toggleShowCommentInput,
      setComment,
      saveComment,
    } = useCommentService({ id: comment.id, type: 'create' });

    const commentAttachments = useMemo(() => {
      return comment?.attachments
        ? comment?.attachments.map((attach) => ({
            uid: attach.path,
            url: attach.path,
            name: attach.name,
          }))
        : [];
    }, [comment.attachments]);

    const {
      comment: commentEdit,
      isShowCommentInput: isShowCommentInputEdit,
      isSaveLoading: isEditLoading,
      attachments,
      setAttachments,
      toggleShowCommentInput: toggleShowCommentInputEdit,
      setComment: setCommentEdit,
      saveComment: editComment,
    } = useCommentService({
      id: comment.id,
      type: 'edit',
      initialValue: comment.body,
      initialAttachments: commentAttachments,
      closeAfterSave: true,
      resetAfterClose: true,
    });

    const {
      value: isLiked,
      likesCount,
      toggleValue: toggleLike,
    } = useToggleLikeOrSave({
      initialValue: !!comment.isLiked,
      postOrCommentId: comment.id,
      type: 'comment',
      initialLikesCount: comment.likesCount,
    });

    const [commentInputId] = useState<string>(Date.now().toString());

    useEffect(() => {
      if (isShowCommentInput) {
        setReplyInputId(commentInputId);
      }
    }, [commentInputId, isShowCommentInput, setReplyInputId]);

    useEffect(() => {
      if (replyInputId && replyInputId !== commentInputId) {
        if (isShowCommentInput) toggleShowCommentInput();
        if (isShowCommentInputEdit) toggleShowCommentInputEdit();
        setReplyInputId(null);
      }
    }, [
      isShowCommentInput,
      isShowCommentInputEdit,
      commentInputId,
      replyInputId,
    ]);
    const isOwnComment = comment.createdByUserId === currentUser?.id;

    // const canActionComment =
    //   isOwnComment ||
    //   (currentUser?.role === UserRole.Admin && !isOwnComment) ||
    //   currentUser?.role === UserRole.WorkSpaceOwner ||
    //   userRole === CommunityRole.CommunityMoModerator;

    const canActionComment =
      isOwnComment || permissions?.commentEdit || globalPermission?.commentEdit;

    return (
      <CommonCommentItem
        createdAt={
          <S.DateText type="secondary">
            {formatCommentCreatedAt(comment.createdAt, comment.updatedAt)}
          </S.DateText>
        }
        body={
          <>
            {isShowCommentInputEdit ? (
              <CommentInput
                showTitle={false}
                comment={commentEdit}
                saveText="Edit"
                isLoading={isEditLoading}
                footer={
                  <UploadAttachments
                    files={attachments}
                    note="max 10 files of any of the types: pdf, docx, xlsx, ppt, pptx, txt, png, jpeg, jpg. Max file size 5Mb."
                    onChange={setAttachments}
                  />
                }
                onChangeComment={setCommentEdit}
                onClose={toggleShowCommentInputEdit}
                onSave={editComment}
              />
            ) : (
              <Stack vertical spacing="none">
                <S.CommentWrapper
                  dangerouslySetInnerHTML={{ __html: comment.body }}
                />
                {comment?.attachments && comment?.attachments?.length > 0 && (
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
                <Stack alignment="center" spacing="extraTight" split="•">
                  {canReply && (
                    <S.ActionButton
                      type="link"
                      onClick={toggleShowCommentInput}
                    >
                      Reply
                    </S.ActionButton>
                  )}
                  <S.ActionButton
                    type="link"
                    active={isLiked}
                    onClick={toggleLike}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </S.ActionButton>
                  <S.ActionText>
                    {formatSingular(likesCount, CountLabels.LIKES)}
                  </S.ActionText>
                </Stack>
              </Stack>
            )}
          </>
        }
        userName={`${user?.firstName} ${user?.lastName}`}
        userPronoun={user?.pronoun}
        avatar={
          <UserAvatar
            shape="circle"
            firstName={user?.firstName || ''}
            lastName={user?.lastName || ''}
            src={user?.avatarUrl}
          />
        }
        badges={
          createdByUserId === comment?.createdByUserId && (
            <Stack spacing="extraTight">
              <OriginalPosterLabel />
            </Stack>
          )
        }
        dropdown={
          <CommentDropdown
            comment={comment}
            canDelete={canActionComment}
            canReport={!isOwnComment}
            onEdit={canActionComment ? toggleShowCommentInputEdit : undefined}
          />
        }
        footer={
          isShowCommentInput ? (
            <CommentInput
              ref={replyInputRef}
              autoFocus
              comment={commentInput}
              currentUser={currentUser}
              isLoading={isSaveLoading}
              footer={
                <UploadAttachments
                  files={replyCommentAttachments}
                  note="max 10 files of any of the types: pdf, docx, xlsx, ppt, pptx, txt, png, jpeg, jpg. Max file size 5Mb."
                  onChange={setReplyCommentAttachments}
                />
              }
              onChangeComment={setComment}
              onClose={toggleShowCommentInput}
              onSave={() => {
                replyInputRef?.current?.clear();
                saveComment();
              }}
            />
          ) : null
        }
      />
    );
  }
);
