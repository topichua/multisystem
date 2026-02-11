import { Users02 } from '@untitled-ui/icons-react';
import { useMemo, useState, useEffect } from 'react';
import { useBoolean, useDebounce } from 'ahooks';
import { Empty, Skeleton, notification } from 'antd';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import {
  CommunitiyDto,
  CreateCommunityDto,
} from 'src/transport/communities/communities.dto';
import { communityApi } from 'src/transport/communities/communities.api';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { isUserAdmin } from 'src/utils/post/user';

import { PageContent } from '../admin-pages-layout.styled';

import { CreateCommunityModal } from './__components/create-community-modal/create-community-modal';
import { CommunitiesTable } from './__components/communities-table/communities-table';

import * as S from './admin-communities-list.styled';

export const AdminCommunitiesList = observer(() => {
  const navigate = useNavigate();
  const { user } = useCurrentUserStore();

  const [communities, setCommunities] = useState<CommunitiyDto[]>([]);
  const [totalItemCount, setTotalItemCount] = useState<number | null>(null);
  const [
    isLoadingCommunities,
    { setTrue: startLoadingCommunities, setFalse: finishLoadingCommunities },
  ] = useBoolean(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const delayedSearch = useDebounce(search, { wait: 400 });

  const [
    isActionCommunityLoading,
    {
      setTrue: showActionCommunityLoading,
      setFalse: hideActionCommunityLoading,
    },
  ] = useBoolean(false);

  const [
    isOpenCreateCommunityModal,
    { setTrue: openCreateCommunityModal, setFalse: closeCreateCommunityModal },
  ] = useBoolean(false);

  const [communityForDelete, setCommunityForDelete] =
    useState<CommunitiyDto | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [delayedSearch]);

  const fetchCommunities = () => {
    startLoadingCommunities();

    communityApi
      .getAllCommunities()
      .then((res) => {
        setCommunities(res.communities);
        setTotalItemCount(res.totalItemCount);
        finishLoadingCommunities();
      })
      .catch((e) => {
        notification.error({
          message: 'Error fetching community. Try again.',
          description: (e as AxiosError)?.response?.data as string,
        });
      });
  };

  const onCreateCommunity = (values: CreateCommunityDto) => {
    showActionCommunityLoading();

    communityApi
      .createCommunity({ ...values })
      .then(() => {
        fetchCommunities();
        hideActionCommunityLoading();
        closeCreateCommunityModal();
      })
      .catch((e) => {
        notification.error({
          message: 'Error creating community. Try again.',
          description: (e as AxiosError)?.response?.data as string,
        });
      });
  };

  const onDeleteCommunity = () => {
    const communityId = communityForDelete?.id as string;
    showActionCommunityLoading();

    communityApi
      .deleteCommunity(communityId)
      .then(() => {
        const updatedCommunities = communities.map((community) => ({
          ...community,
          isDeleted: community.id === communityId ? true : community.isDeleted,
        }));

        setCommunities(updatedCommunities);
        setTotalItemCount((prev) => (prev ? prev - 1 : 0));
        hideActionCommunityLoading();
        setCommunityForDelete(null);
      })
      .catch((e) => {
        notification.error({
          message: 'Error deleting community. Try again.',
          description: (e as AxiosError)?.message,
        });
      });
  };

  const navigateToCommunity = (id: string) => {
    navigate(`/admin/community/${id}/about`);
  };

  const filteredCommunities = useMemo(() => {
    const normalizedSearch = delayedSearch.trim().toLowerCase();

    return communities.filter(
      (community) =>
        community.name.toLowerCase().includes(normalizedSearch) ||
        community.categories?.some((category) =>
          category.name.toLowerCase().includes(normalizedSearch)
        )
    );
  }, [communities, delayedSearch]);

  const content = useMemo(() => {
    if (isLoadingCommunities) {
      return <Skeleton active />;
    }

    if (!communities || communities.length === 0) {
      return (
        <Empty description="No communities yet" style={{ paddingTop: 24 }} />
      );
    }

    return (
      <CommunitiesTable
        communities={filteredCommunities}
        currentPage={currentPage}
        onChangeCurrentPage={setCurrentPage}
        onDeleteCommunity={setCommunityForDelete}
        onNavigateToCommunity={navigateToCommunity}
      />
    );
  }, [communities, isLoadingCommunities, filteredCommunities, currentPage]);

  const isAdmin = isUserAdmin(user);

  return (
    <>
      <InnerPageHeader
        icon={<Users02 />}
        title={
          <>
            Communities {totalItemCount != null ? ` (${totalItemCount})` : ''}
          </>
        }
      >
        <S.HeaderWrapper>
          {isAdmin && (
            <Button type="primary" onClick={openCreateCommunityModal}>
              Create community
            </Button>
          )}
        </S.HeaderWrapper>
      </InnerPageHeader>
      <PageContent>
        {isAdmin && (
          <CreateCommunityModal
            isOpen={isOpenCreateCommunityModal}
            isLoading={isActionCommunityLoading}
            onCreate={onCreateCommunity}
            onClose={closeCreateCommunityModal}
          />
        )}

        <Stack vertical>
          <S.SearchVarWrapper>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              style={{ margin: '0 auto' }}
            />
          </S.SearchVarWrapper>
          {content}
        </Stack>

        <ConfirmModal
          isOpen={!!communityForDelete}
          confirmButtonProps={{ danger: true }}
          title={`Are you sure you want to delete ${communityForDelete?.name} community`}
          isLoading={isActionCommunityLoading}
          confirmButtonText="Delete"
          onClose={() => setCommunityForDelete(null)}
          onConfirm={onDeleteCommunity}
        />
      </PageContent>
    </>
  );
});
