import { useEffect, useMemo, useState } from 'react';
import { Tag01 } from '@untitled-ui/icons-react';
import { useBoolean, useDebounce } from 'ahooks';

import { Button } from 'src/components/common/Button/Button';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Page } from 'src/components/common/page/page';
import { communityApi } from 'src/transport/communities/communities.api';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { CommunityAdmin } from 'src/transport/communities/communities.dto';

import { CreateAdminModal } from './__components/create-admin-modal/create-admin-modal';
import { AdminsTable } from './__components/admins-table/admins-table';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { UserRole } from 'src/transport/account/account.dto';

export const AdminCommunitiesManagementAdministrators = () => {
  const [admins, setAdmins] = useState<CommunityAdmin[]>([]);
  const [totalAdmins, setTotalAdmins] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [
    isFetchAdminsLoading,
    { setTrue: startFetchAdmins, setFalse: finishFetchAdmins },
  ] = useBoolean(false);

  const [
    isCreateAdminModalOpen,
    { setTrue: openCreateModal, setFalse: closeCreateModal },
  ] = useBoolean(false);
  const [
    isCreateAdminLoading,
    { setTrue: startCreateLoading, setFalse: finishCreateLoading },
  ] = useBoolean(false);
  const [
    isDeleteAdminLoading,
    { setTrue: startDeleteLoading, setFalse: finishDeleteLoading },
  ] = useBoolean(false);

  const [selectedAdminForDelete, setSelectedAdminForDelete] =
    useState<CommunityAdmin | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, { wait: 600 });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    startFetchAdmins();

    communityApi
      .getAdmins({})
      .then(({ users, totalItemCount }) => {
        setAdmins(users);
        setTotalAdmins(totalItemCount);
      })
      .finally(finishFetchAdmins);
  };

  const handleCreateAdmin = (email: string) => {
    startCreateLoading();

    communityApi
      .createAdmin(email, UserRole.Manager)
      .then(() => {
        closeCreateModal();
        fetchAdmins();
      })
      .finally(finishCreateLoading);
  };

  const handleDeleteAdmin = () => {
    startDeleteLoading();

    communityApi
      .deleteAdmin(selectedAdminForDelete?.email as string)
      .then(() => {
        setSelectedAdminForDelete(null);
        fetchAdmins();
      })
      .finally(finishDeleteLoading);
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) =>
      admin.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [admins, debouncedSearch]);

  return (
    <>
      <InnerPageHeader
        icon={<Tag01 />}
        title={`Managers management (${totalAdmins ?? ''})`}
      >
        <Stack distribution="trailing">
          <Button type="primary" onClick={openCreateModal}>
            Add manager
          </Button>
        </Stack>
      </InnerPageHeader>

      <Page.Content>
        <Stack vertical>
          <div style={{ width: 300 }}>
            <SearchBar
              value={search}
              placeholder="Search by email"
              style={{ margin: '0 auto' }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <AdminsTable
            currentPage={page}
            admins={filteredAdmins}
            isLoading={isFetchAdminsLoading}
            onDeleteAdmin={setSelectedAdminForDelete}
            onChangeCurrentPage={setPage}
          />
        </Stack>
      </Page.Content>

      <CreateAdminModal
        isOpen={isCreateAdminModalOpen}
        isLoading={isCreateAdminLoading}
        onClose={closeCreateModal}
        onSave={handleCreateAdmin}
      />

      <ConfirmModal
        isOpen={!!selectedAdminForDelete}
        confirmButtonProps={{ danger: true }}
        title={`Are you sure you want to delete ${selectedAdminForDelete?.email}?`}
        confirmButtonText="Delete"
        isLoading={isDeleteAdminLoading}
        onClose={() => setSelectedAdminForDelete(null)}
        onConfirm={handleDeleteAdmin}
      />
    </>
  );
};
