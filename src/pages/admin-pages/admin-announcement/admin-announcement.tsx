import { useState } from 'react';
import { Announcement01 } from '@untitled-ui/icons-react';

import { Button } from 'src/components/common/Button/Button';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Announcement } from 'src/transport/announcement/announcement.dto';
import { Page } from 'src/components/common/page/page';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';

import {
  AnnouncementFormValues,
  CreateAnnouncementModal,
} from './__components/create-announcement-modal';
import { useAnnouncement } from './__hooks/useAnnouncement';
import { AnnouncementTable } from './__components/announcement-table';

export const AdminAnnouncement = () => {
  const {
    announcements,
    isAnnouncementsLoading,
    isMutateAnnouncementLoading,
    mutateAnnouncement,
    setActiveToAnnouncement,
    deleteAnnouncement,
    creators,
  } = useAnnouncement();

  const [selectedAnnouncementForEdit, setSelectedAnnouncementForEdit] =
    useState<Partial<Announcement> | null>(null);
  const [selectedAnnouncementForActivate, setSelectedAnnouncementForActivate] =
    useState<Partial<Announcement> | null>(null);
  const [selectedAnnouncementForDelete, setSelectedAnnouncementForDelete] =
    useState<Partial<Announcement> | null>(null);

  const [page, setPage] = useState(1);

  const handleMutateAnnouncement = (values: AnnouncementFormValues) => {
    mutateAnnouncement(values).then(() => setSelectedAnnouncementForEdit(null));
  };

  const handleActivateAnnouncement = () => {
    setActiveToAnnouncement(selectedAnnouncementForActivate?.id as string).then(
      () => setSelectedAnnouncementForActivate(null)
    );
  };

  const handleDeleteAnnouncement = () => {
    deleteAnnouncement(selectedAnnouncementForDelete?.id as string).then(() =>
      setSelectedAnnouncementForDelete(null)
    );
  };

  return (
    <>
      <InnerPageHeader icon={<Announcement01 />} title="Announcement">
        <Stack distribution="trailing">
          <Button
            type="primary"
            onClick={() => setSelectedAnnouncementForEdit({})}
          >
            Create announcement
          </Button>
        </Stack>
      </InnerPageHeader>

      <Page.Content>
        <AnnouncementTable
          announcements={announcements}
          currentPage={page}
          isLoading={isAnnouncementsLoading}
          onChangeCurrentPage={setPage}
          onDeleteAnnouncement={setSelectedAnnouncementForDelete}
          onActivateAnnouncement={setSelectedAnnouncementForActivate}
          onEditAnnouncement={setSelectedAnnouncementForEdit}
          creators={creators}
        />
      </Page.Content>

      <CreateAnnouncementModal
        announcement={selectedAnnouncementForEdit}
        isLoading={isMutateAnnouncementLoading}
        onConfirm={handleMutateAnnouncement}
        onClose={() => setSelectedAnnouncementForEdit(null)}
      />

      <ConfirmModal
        isOpen={!!selectedAnnouncementForActivate}
        title={`Are you sure you want to activate ${selectedAnnouncementForActivate?.title} announcement?`}
        description="Only one announcement can be active at a time. The current active announcement will be deactivated."
        confirmButtonText="Activate"
        isLoading={isMutateAnnouncementLoading}
        onClose={() => setSelectedAnnouncementForActivate(null)}
        onConfirm={handleActivateAnnouncement}
      />

      <ConfirmModal
        isOpen={!!selectedAnnouncementForDelete}
        confirmButtonProps={{ danger: true }}
        confirmButtonText="Delete"
        title={`Are you sure you want to delete ${selectedAnnouncementForDelete?.title} announcement?`}
        isLoading={isMutateAnnouncementLoading}
        onClose={() => setSelectedAnnouncementForDelete(null)}
        onConfirm={handleDeleteAnnouncement}
      />
    </>
  );
};
