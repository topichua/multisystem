import { useEffect, useMemo, useState } from 'react';
import { Tag01 } from '@untitled-ui/icons-react';
import { useBoolean, useDebounce } from 'ahooks';
import { notification } from 'antd';

import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { communityTagsApi } from 'src/transport/communities/community.tag.api';
import { Page } from 'src/components/common/page/page';
import { SearchBar } from 'src/components/common/Searchbar/Searchbar';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { PostTag } from 'src/transport/communities/communities.dto';

import {
  CreateTagModal,
  TagFormValues,
} from './__components/create-tag-modal/create-tag-modal';
import { TagsTable } from './__components/tags-table/tags-table';

export const AdminCommunitiesManagementTags = () => {
  const [createOrEditTag, setCreateOrEditTag] =
    useState<Partial<PostTag> | null>(null);
  const [deleteTag, setDeleteTag] = useState<PostTag | null>(null);

  const [tags, setTags] = useState<any[]>([]);
  const [tagsCount, setTagsCount] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, { wait: 600 });

  const [
    isCreateDeleteOrEditLoading,
    { setTrue: startLoading, setFalse: finishLoading },
  ] = useBoolean(false);
  const [
    isFetchTagsLoading,
    { setTrue: startFetchTagsLoading, setFalse: finishFetchTagsLoading },
  ] = useBoolean(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchTags = () => {
    startFetchTagsLoading();

    communityTagsApi
      .getTags({})
      .then(({ tags, totalItemCount }) => {
        setTags(tags);
        setTagsCount(totalItemCount);
      })
      .finally(finishFetchTagsLoading);
  };

  const handleEditOrCreateTag = (tag: TagFormValues) => {
    startLoading();

    const request = tag.id
      ? communityTagsApi.editTag
      : communityTagsApi.createTag;

    request(tag)
      .then(() => {
        fetchTags();
        setCreateOrEditTag(null);
      })
      .catch((e) => {
        notification.error({
          message: 'Error creating/edit tag. Try again.',
          description: e?.message,
        });
      })
      .finally(finishLoading);
  };

  const handleDeleteTag = () => {
    startLoading();

    communityTagsApi
      .deleteTag(deleteTag?.id as string)
      .then(() => {
        fetchTags();
        setDeleteTag(null);
      })
      .catch((e) => {
        notification.error({
          message: 'Error deleting tag. Try again.',
          description: e?.message,
        });
      })
      .finally(finishLoading);
  };

  const filteredTags = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [tags, debouncedSearch]);

  return (
    <>
      <InnerPageHeader
        icon={<Tag01 />}
        title={
          <>Tags management {tagsCount != null ? ` (${tagsCount})` : ''}</>
        }
      >
        {/*<Stack distribution="trailing">
          <Button type="primary" onClick={() => setCreateOrEditTag({})}>
            Create tag
          </Button>
        </Stack>*/}
      </InnerPageHeader>

      <Page.Content>
        <Stack vertical>
          <div style={{ width: 300 }}>
            <SearchBar
              value={search}
              placeholder="Search"
              style={{ margin: '0 auto' }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <TagsTable
            tags={filteredTags}
            isLoading={isFetchTagsLoading}
            currentPage={page}
            onChangeCurrentPage={setPage}
            onDeleteCategory={setDeleteTag}
            onEditCategory={setCreateOrEditTag}
          />
        </Stack>
      </Page.Content>

      <CreateTagModal
        isOpen={!!createOrEditTag}
        tag={createOrEditTag}
        isLoading={isCreateDeleteOrEditLoading}
        onClose={() => setCreateOrEditTag(null)}
        onCreateOrUpdate={handleEditOrCreateTag}
      />

      <ConfirmModal
        isOpen={!!deleteTag}
        confirmButtonProps={{ danger: true }}
        title={`Are you sure you want to delete ${deleteTag?.name} tag`}
        isLoading={isCreateDeleteOrEditLoading}
        confirmButtonText="Delete"
        onClose={() => setDeleteTag(null)}
        onConfirm={handleDeleteTag}
      />
    </>
  );
};
