import { Settings02 } from '@untitled-ui/icons-react';
import { useForm } from 'antd/es/form/Form';
import { observer } from 'mobx-react';
import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { AxiosError } from 'axios';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { communityApi } from 'src/transport/communities/communities.api';

import { AdminCommunityEditForm } from '../__components/admin-community-edit-form/admin-community-edit-form';
import { useCommunityManagementStore } from '../admin-community.provider';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { dateNullFormat } from 'src/utils/date-time';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

export const AdminCommunitySettings = observer(() => {
  const { community, permissions, loadCommunity } =
    useCommunityManagementStore();
  const { globalPermission } = useCurrentUserStore();

  const [
    isArchiveModalOpen,
    { setTrue: openArchiveModal, setFalse: closeArchiveModal },
  ] = useBoolean(false);

  const [
    isSaveLoading,
    { setTrue: startSaveLoading, setFalse: finishSaveLoading },
  ] = useBoolean(false);
  const [
    isArchiveLoading,
    { setTrue: startArchiveLoading, setFalse: finishArchiveLoading },
  ] = useBoolean(false);

  const [form] = useForm();

  const handleArchiveCommunity = () => {
    startArchiveLoading();

    const communityId = community?.id as string;
    const isArchived = !community?.isArchived;

    communityApi
      .editCommunity({
        id: communityId,
        isArchived,
        archivedDate: isArchived ? dateNullFormat : undefined,
      })
      .then(() => {
        notification.success({
          message: `${isArchived ? 'Archived' : 'Unarchived'} successfully`,
        });

        loadCommunity().then(() => {
          if (isArchived) {
            form.setFieldValue('archivedDate', null);
          }
        });
      })
      .catch((e) => {
        notification.error({
          message: `${isArchived ? 'Archived' : 'Unarchived'} failed`,
          description: (e as AxiosError).message,
        });
      })
      .finally(() => {
        finishArchiveLoading();
        closeArchiveModal();
      });
  };

  const editSettings = () => {
    startSaveLoading();

    const { alias, ...values } = form.getFieldsValue();
    const communityId = community?.id as string;

    communityApi
      .editCommunity({
        ...values,
        alias: alias === community?.alias ? undefined : alias,
        id: communityId,
      })
      .then(() => {
        loadCommunity();
        notification.success({ message: 'Successfully saved' });
      })
      .catch((e) => {
        notification.error({ message: (e as AxiosError).message });
      })
      .finally(finishSaveLoading);
  };

  const canEdit = permissions?.commentEdit || globalPermission?.commentEdit;

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Settings02 />}
          title="Admin settings"
          fillChildren={false}
        >
          {canEdit && (
            <Stack alignment="center" distribution="trailing">
              <Button
                danger={!community?.isArchived}
                onClick={openArchiveModal}
              >
                {community?.isArchived ? 'Unarchive' : 'Archive'}
              </Button>
              <Button
                type="primary"
                loading={isSaveLoading}
                onClick={form.submit}
              >
                Save
              </Button>
            </Stack>
          )}
        </InnerPageHeader>
      </FixedContentHeader>

      <Page.Content>
        <AdminCommunityEditForm
          form={form}
          community={community}
          readonly={!canEdit}
          onSubmit={editSettings}
        />
      </Page.Content>

      <ConfirmModal
        isOpen={isArchiveModalOpen}
        title={`Are you sure you want to ${community?.isArchived ? 'unarchive' : 'archive'} this community?`}
        confirmButtonText={community?.isArchived ? 'Unarchive' : 'Archive'}
        confirmButtonProps={{ danger: !community?.isArchived }}
        isLoading={isArchiveLoading}
        onClose={closeArchiveModal}
        onConfirm={handleArchiveCommunity}
      />
    </>
  );
});
