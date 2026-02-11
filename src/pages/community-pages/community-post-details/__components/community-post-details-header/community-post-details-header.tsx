import { AnnotationX, Edit04, Trash01 } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { PermissionDto } from 'src/transport/account/account.dto';
import { Post, PostStatus } from 'src/transport/posts/posts.dto';

const iconSizes = {
  width: 16,
  height: 16,
};

type CommunityPostDetailsHeaderProps = {
  post: Post | null;
  isCurrentUserOwner: boolean;
  isCurrentUserAdmin: boolean;
  permissions: PermissionDto | null;
  openEditModal: () => void;
  openDeleteModal: () => void;
  openPublishModal: () => void;
  openUnfreezeModal: () => void;
};

export const CommunityPostDetailsHeader = observer(
  ({
    post,
    isCurrentUserOwner,
    permissions,
    openEditModal,
    openDeleteModal,
    openPublishModal,
    openUnfreezeModal,
  }: CommunityPostDetailsHeaderProps) => {
    const { globalPermission } = useCurrentUserStore();

    const isPostDeleted = post?.status === PostStatus.Deleted;
    const isPostFrozen = post?.isFrozen;
    const canPermissionPostEdit =
      permissions?.postEdit || globalPermission?.postEdit;

    const canEdit =
      (isCurrentUserOwner || canPermissionPostEdit) &&
      !isPostDeleted &&
      !isPostFrozen;
    const canRestorePost = canPermissionPostEdit && isPostDeleted;
    const canOpenPost = isPostFrozen && canPermissionPostEdit && !isPostDeleted;

    return (
      <Stack alignment="center" fill>
        {(isPostDeleted || isPostFrozen) && (
          <Tag
            color={isPostDeleted ? 'error' : 'warning'}
            size="small"
            icon={
              isPostDeleted ? (
                <Trash01 {...iconSizes} />
              ) : (
                <AnnotationX {...iconSizes} />
              )
            }
          >
            {isPostDeleted ? 'Deleted' : 'Closed'} post
          </Tag>
        )}

        {canEdit && (
          <Stack.Item fill>
            <Stack distribution="trailing">
              <Button icon={<Edit04 {...iconSizes} />} onClick={openEditModal}>
                Edit post
              </Button>
              <Button
                danger
                icon={<Trash01 {...iconSizes} />}
                onClick={openDeleteModal}
              />
            </Stack>
          </Stack.Item>
        )}

        {canRestorePost && (
          <Stack.Item fill>
            <Stack distribution="trailing">
              <Button
                type="primary"
                icon={<Edit04 {...iconSizes} />}
                onClick={openPublishModal}
              >
                Restore post
              </Button>
            </Stack>
          </Stack.Item>
        )}

        {canOpenPost && (
          <Stack.Item fill>
            <Stack distribution="trailing">
              <Button type="primary" onClick={openUnfreezeModal}>
                Open post
              </Button>
            </Stack>
          </Stack.Item>
        )}
      </Stack>
    );
  }
);
