import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, DotsGrid } from '@untitled-ui/icons-react';
import { Flex, notification, Spin, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { isEmpty, isNil } from 'lodash';
import { FC, useMemo, useState } from 'react';
import {
  CommunityAssetsItem,
  AssetsTypeEnum,
} from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';
import { getCalendarDateTime } from 'src/utils/date-time';
import { AddFileModal } from './add-file-modal';
import { useFolderRename } from './hooks/useFolderRename';
import { RenameFolderModal } from './rename-folder-modal';
import { RenameModal } from './rename-modal';
import { AssetsActions } from './assets-actions';
import { AssetLabel } from './assets-label';
import { AssetsTable } from './assets-table';
import { AssetRenderer } from './assets-table-columns';
import * as U from './assets-table.utils';
import * as S from './assets.styled';

const { Text } = Typography;

export const AssetsSection: FC<{
  title: string;
  description: string;
  assetsItems: CommunityAssetsItem[];
  folderId: string;
  communityId: string;
  expandedKeys: string | string[];
  setExpandedKeys: React.Dispatch<React.SetStateAction<string | string[]>>;
  fetchFoldersAndItems: () => void;
  isUserModerator: boolean;
  isFolderReorderLoading: boolean;
  isDraggable: boolean;
  showActions?: boolean;
}> = ({
  title,
  description,
  assetsItems,
  folderId,
  communityId,
  expandedKeys,
  setExpandedKeys,
  fetchFoldersAndItems,
  isUserModerator,
  isFolderReorderLoading,
  isDraggable,
  showActions = true,
}) => {
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<CommunityAssetsItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const {
    folderRename,
    setFolderRename,
    editFilesInFolder,
    handleFolderModalCancel,
    isEditFilesInFolderLoading,
    editFolder,
    isEditFolderLoading,
  } = useFolderRename({
    folderId,
    communityId,
    assetsItems,
    onFetchSuccess: fetchFoldersAndItems,
  });

  const stopPropagation = (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
    event.stopPropagation();

  const deleteFolder = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setLoading(true);
    stopPropagation(event);
    communityAssetsApi
      .deleteCommunityAssetsFolder(communityId, folderId)
      .then(() => {
        notification.success({
          message: 'Folder and files successfully deleted',
        }),
          fetchFoldersAndItems();
      })
      .catch(() => {
        notification.error({
          message: `Folder and files are not deleted`,
        });
      })
      .finally(() => setLoading(false));
  };

  const openRenameModal = (item: any) => {
    setEditingItem(item);
    setIsRenameModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, name: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, description: e.target.value });
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, path: e.target.value });
    }
  };

  const handleRename = () => {
    setLoading(true);
    if (!editingItem) return;

    const renamePromise =
      editingItem.type === AssetsTypeEnum.Folder
        ? communityAssetsApi.updateCommunityAssetsFolder(
            communityId,
            folderId,
            editingItem
          )
        : communityAssetsApi.updateCommunityAssetsItem(
            communityId,
            folderId,
            editingItem.id,
            editingItem
          );

    renamePromise
      .then(() => {
        notification.success({
          message: 'Item renamed successfully.',
        });
        setIsRenameModalOpen(false);
        return fetchFoldersAndItems();
      })
      .catch(() => {
        notification.error({
          message: 'Failed to rename item.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<CommunityAssetsItem> = [
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record: CommunityAssetsItem) => (
        <AssetRenderer record={record} />
      ),
      sorter: !isDraggable ? (a, b) => a.name.localeCompare(b.name) : undefined,
      sortIcon: U.getSortIcon,
      defaultSortOrder: !isDraggable ? 'ascend' : undefined,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      sorter: !isDraggable ? (a, b) => a.type - b.type : undefined,
      sortIcon: U.getSortIcon,
      render: (text: string, record: CommunityAssetsItem) => {
        text;
        return (
          <Text>{record.type === AssetsTypeEnum.Link ? 'Link' : 'File'}</Text>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 176,
      render: (text: string, record: CommunityAssetsItem) => {
        text;
        return <>{getCalendarDateTime(record.createdAt)}</>;
      },
      sortIcon: U.getSortIcon,
      sorter: !isDraggable
        ? (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : undefined,
    },
    {
      title: 'View',
      dataIndex: 'action',
      hidden: !showActions,
      key: 'action',
      render: (text: string, record: CommunityAssetsItem) => {
        text;
        return (
          <AssetsActions
            record={record}
            onRename={openRenameModal}
            communityId={communityId}
            folderId={folderId}
            fetchFoldersAndItems={fetchFoldersAndItems}
          />
        );
      },
      width: 150,
    },
  ];

  const hasFiles = useMemo(
    () => !isNil(assetsItems) && !isEmpty(assetsItems),
    [assetsItems]
  );

  const { attributes, setNodeRef, transform, transition } = useSortable({
    id: folderId,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Flex align="center" ref={setNodeRef} style={style} {...attributes}>
      <AddFileModal
        visible={isAddFileModalOpen}
        onCancel={() => setIsAddFileModalOpen(false)}
        communityId={communityId}
        folderId={folderId}
        setIsAddFileModalOpen={setIsAddFileModalOpen}
        fetchFoldersAndItems={fetchFoldersAndItems}
      />

      <RenameFolderModal
        title={hasFiles ? 'Edit Folder and Files' : 'Folder Details'}
        onEditFolder={editFolder}
        folderParams={folderRename}
        assetsItems={assetsItems}
        onFilesSubmit={editFilesInFolder}
        onCancel={handleFolderModalCancel}
        isEditFolderLoading={isEditFolderLoading}
        isEditFilesInFolderLoading={isEditFilesInFolderLoading}
      />

      <RenameModal
        visible={isRenameModalOpen}
        onCancel={() => setIsRenameModalOpen(false)}
        onOk={handleRename}
        editingItem={editingItem}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        onLinkChange={handleLinkChange}
        okButtonProps={{
          loading: loading,
        }}
        cancelButtonProps={{
          disabled: loading,
        }}
      />
      <DragHandle
        isDraggable={isDraggable}
        id={folderId}
        isFolderReorderLoading={isFolderReorderLoading}
      />
      <S.Collapse
        $isDraggable={isDraggable}
        expandIcon={({ isActive }) =>
          isActive ? <ChevronUp /> : <ChevronDown />
        }
        activeKey={expandedKeys}
        onChange={(keys) => setExpandedKeys(keys)}
        items={[
          {
            key: folderId,
            label: (
              <AssetLabel
                isUserModerator={isUserModerator}
                title={title}
                description={description}
                itemCount={assetsItems.length}
                loading={loading}
                showActions={showActions}
                onAddFile={(e) => {
                  stopPropagation(e);
                  setIsAddFileModalOpen(true);
                }}
                onRename={(e) => {
                  stopPropagation(e);
                  setFolderRename({
                    name: title,
                    description,
                    id: folderId,
                  });
                }}
                onDelete={deleteFolder}
              />
            ),
            children: (
              <AssetsTable
                communityId={communityId}
                data={assetsItems}
                columns={columns}
                folderId={folderId}
                isDraggable={isDraggable}
              />
            ),
          },
        ]}
        expandIconPosition="end"
      />
    </Flex>
  );
};

const DragHandle = ({
  id,
  isFolderReorderLoading,
  isDraggable,
}: {
  id: string;
  isFolderReorderLoading: boolean;
  isDraggable: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transition } = useSortable({
    id,
    disabled: !isDraggable,
  });

  const style = {
    transition,
    cursor: 'move',
    marginRight: 20,
    marginTop: -24,
  };

  if (!isDraggable) return null;

  return (
    <Spin
      spinning={isFolderReorderLoading}
      size="small"
      style={{ height: 16, width: 16, marginTop: -24 }}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <DotsGrid height={16} width={16} />
      </div>
    </Spin>
  );
};
