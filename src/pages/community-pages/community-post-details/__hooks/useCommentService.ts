import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { UploadAttachment } from 'src/components/common/UploadAttachments/UploadAttachments';

import { useCommunityPostDetailsStore } from '../community-post-details.provider';

type UseCommentServiceOptions = {
  initialValue?: string;
  initialAttachments?: UploadAttachment[];
  resetAfterClose?: boolean;
  closeAfterSave?: boolean;
};

type UseCreateCommentOptions = {
  type: 'create';
  id: string | null;
} & UseCommentServiceOptions;

type UseEditCommentOptions = {
  type: 'edit';
  id: string;
} & UseCommentServiceOptions;

export const useCommentService = ({
  id,
  type,
  initialValue = '',
  initialAttachments,
  resetAfterClose = false,
  closeAfterSave = true,
}: UseCreateCommentOptions | UseEditCommentOptions) => {
  const {
    createCommentLoadingId,
    editCommentLoadingId,
    createComment,
    editComment,
  } = useCommunityPostDetailsStore();

  const [
    isShowCommentInput,
    { toggle: toggleShowCommentInput, setFalse: closeCommentInput },
  ] = useBoolean(false);

  const [replyInputId, setReplyInputId] = useState<string | null>(null);

  const [comment, setComment] = useState(initialValue);
  const [attachments, setAttachments] = useState<UploadAttachment[]>(
    initialAttachments ?? []
  );

  useEffect(() => {
    if (!isShowCommentInput && resetAfterClose) {
      setComment(initialValue);

      if (initialAttachments) setAttachments(initialAttachments);
    }
  }, [resetAfterClose, isShowCommentInput]);

  useEffect(() => {
    if (!isShowCommentInput) {
      setComment(initialValue);
      if (initialAttachments) setAttachments(initialAttachments);
    }
  }, [initialAttachments, initialValue]);

  const saveComment = async () => {
    if (type === 'create') {
      return createComment({
        body: comment,
        parentCommentId: id || null,
        files: attachments,
      })
        .then(() => {
          setComment(initialValue);
          setAttachments(initialAttachments ?? []);
          if (closeAfterSave) closeCommentInput();
        })
        .catch((e) => {
          const errorText = e?.response?.data?.Message || e?.response?.data;
          notification.error({
            message: 'Error creating comment. Try again.',
            description: errorText,
          });
        })
        .finally(() => {
          if (closeAfterSave) closeCommentInput();
        });
    }

    return editComment(id, comment, attachments)
      .then(() => {
        if (closeAfterSave) closeCommentInput();
      })
      .catch((e) => {
        const errorText = e?.response?.data?.Message || e?.response?.data;
        notification.error({
          message: 'Error editing comment. Try again.',
          description: errorText,
        });
      });
  };

  const isSaveLoading = useMemo(() => {
    if (type === 'create') {
      return (
        createCommentLoadingId === id ||
        (!id && createCommentLoadingId === true)
      );
    }

    return editCommentLoadingId === id;
  }, [type, id, createCommentLoadingId, editCommentLoadingId]);

  return {
    comment,
    attachments,
    isShowCommentInput,
    isSaveLoading,
    saveComment,
    toggleShowCommentInput,
    setComment,
    setAttachments,
    replyInputId,
    setReplyInputId,
  };
};
