import { useMemo } from 'react';
import { DotsHorizontal } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Dropdown } from 'antd';
import { observer } from 'mobx-react';

import { Button } from 'src/components/common/Button/Button';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { Comment } from 'src/transport/posts/posts.dto';

import { useCommunityPostDetailsStore } from '../../community-post-details.provider';
import { ReportModal } from '../report-modal/report-modal';

type CommentDropdownProps = {
  comment: Comment;
  canDelete?: boolean;
  canReport?: boolean;
  onEdit?: () => void;
};

export const CommentDropdown = observer(
  ({
    comment,
    canDelete = false,
    canReport = false,
    onEdit,
  }: CommentDropdownProps) => {
    const {
      deleteCommentLoading,
      isReportLoading,
      deleteComment,
      reportComment,
    } = useCommunityPostDetailsStore();

    const [
      isOpenDeleteModal,
      { setTrue: showDeleteModal, setFalse: closeDeleteModal },
    ] = useBoolean(false);

    const [
      isOpenReportModal,
      { setTrue: showReportModal, setFalse: closeReportModal },
    ] = useBoolean(false);

    const handleReportComment = (report: string) => {
      reportComment(comment.postId, comment.id, report).then(closeReportModal);
    };

    const handleDeleteComment = () => {
      deleteComment(comment.id, comment.parentCommentId).then(closeDeleteModal);
    };

    const menuItems = useMemo(() => {
      const items = [
        canReport
          ? {
              key: 'report',
              label: 'Report ',
              onClick: showReportModal,
            }
          : null,
        canDelete
          ? {
              key: 'delete',
              label: 'Delete',
              danger: true,
              onClick: showDeleteModal,
            }
          : null,
      ];

      if (onEdit)
        items.unshift({
          key: 'edit',
          label: 'Edit',
          onClick: onEdit,
        });

      return items;
    }, [onEdit, comment, canDelete, canReport]);

    return (
      <>
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <Button type="text" size="small">
            <DotsHorizontal />
          </Button>
        </Dropdown>

        <ConfirmModal
          isOpen={isOpenDeleteModal}
          confirmButtonProps={{ danger: true }}
          title="Delete comment"
          description="Are you sure wanna delete this comment?"
          isLoading={deleteCommentLoading}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteComment}
        />

        <ReportModal
          isOpen={isOpenReportModal}
          isLoading={isReportLoading}
          onReport={handleReportComment}
          onClose={closeReportModal}
        />
      </>
    );
  }
);
