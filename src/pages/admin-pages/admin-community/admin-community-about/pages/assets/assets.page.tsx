import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ArrowNarrowDown,
  ArrowNarrowUp,
  RefreshCcw05,
  SwitchVertical02,
} from '@untitled-ui/icons-react';
import {
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  MenuProps,
  Modal,
  notification,
  Spin,
} from 'antd';
import { observer } from 'mobx-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import {
  CommunityAssetsFolder,
  CommunityAssetsItem,
} from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';
import { AssetsSection } from './assests-section';
import { Page } from 'src/components/common/page/page';
import useSortedAssets, {
  CommunityAssetFolderField,
  TSortingOrder,
} from './hooks/useSortedAssets';

type SortIconProps = {
  field: CommunityAssetFolderField;
  sortingField: CommunityAssetFolderField | null;
  sortingOrder: TSortingOrder;
};

const iconProps = {
  height: 12,
  width: 12,
  color: components.colors.brandColor,
};

const SortIcon: FC<SortIconProps> = ({ field, sortingField, sortingOrder }) => {
  if (field === sortingField) {
    return sortingOrder === 'DESC' ? (
      <ArrowNarrowDown {...iconProps} style={{ marginRight: 10 }} />
    ) : (
      <ArrowNarrowUp {...iconProps} style={{ marginRight: 10 }} />
    );
  } else {
    return (
      <ArrowNarrowDown
        height={12}
        width={12}
        style={{ marginRight: 10 }}
        color="transparent"
        fill="transparent"
      />
    );
  }
};

export const AssetsPage = observer(
  ({
    communityId,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    showActions = false,
  }: {
    communityId: string;
    isCreateFolderModalOpen: boolean;
    setIsCreateFolderModalOpen: (value: boolean) => void;
    showActions: boolean;
  }) => {
    const [folders, setFolders] = useState<CommunityAssetsFolder[]>([]);
    const [items, setItems] = useState<{
      [key: string]: CommunityAssetsItem[];
    }>({});
    const [loading, setLoading] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState<string | string[]>([]);
    const [isFolderReorderLoading, setIsFolderReorderLoading] = useState(false);
    const [form] = Form.useForm();

    const {
      sortedAssets,
      sortingField,
      sortingOrder,
      handleSort,
      handleSortClear,
    } = useSortedAssets(folders);

    const isUserModerator = true;

    const fetchFoldersAndItems = async () => {
      setLoading(true);

      communityAssetsApi
        .getCommunityAssetsFolders(communityId)
        .then((foldersResponse: any) => {
          const foldersData =
            foldersResponse.folders as CommunityAssetsFolder[];
          setFolders(foldersData);

          return Promise.all(
            foldersData.map((folder: CommunityAssetsFolder) =>
              communityAssetsApi.getCommunityAssetsItems(communityId, folder.id)
            )
          ).then((itemsData) => ({ foldersData, itemsData }));
        })
        .then(({ foldersData, itemsData }) => {
          const itemsMap = foldersData.reduce(
            (acc, folder, index) => {
              //@ts-ignore
              acc[folder.id] = itemsData[index].assets as CommunityAssetsItem[];
              return acc;
            },
            {} as { [key: string]: CommunityAssetsItem[] }
          );
          setItems(itemsMap);
        })
        .catch((error) => {
          console.error('Errrrrror:', error);
        })
        .finally(() => setLoading(false));
    };

    const createFolder = () => {
      form
        .validateFields()
        .then((values) => {
          setLoading(true);
          communityAssetsApi
            .createCommunityAssetsFolder(
              communityId,
              values.title,
              values.description
            )
            .then(() => {
              notification.success({
                message: 'Folder created successfully',
              });
              setIsCreateFolderModalOpen(false);
              fetchFoldersAndItems();
            })
            .catch(() => {
              notification.error({
                message: 'Failed to create folder',
              });
            })
            .finally(() => {
              form.resetFields();
              setLoading(false);
            });
        })
        .catch((info) => {
          console.error('Validation Failed:', info);
        });
    };

    useEffect(() => {
      fetchFoldersAndItems();
    }, [communityId]);

    const _items: MenuProps['items'] = useMemo(
      () => [
        {
          label: 'Creation Date',
          key: 'createdAt',
          icon: (
            <SortIcon
              sortingField={sortingField}
              field="createdAt"
              sortingOrder={sortingOrder}
            />
          ),
        },
        {
          label: 'Description',
          key: 'description',
          icon: (
            <SortIcon
              sortingField={sortingField}
              field="description"
              sortingOrder={sortingOrder}
            />
          ),
        },
        {
          label: 'Name',
          key: 'name',
          icon: (
            <SortIcon
              sortingField={sortingField}
              field="name"
              sortingOrder={sortingOrder}
            />
          ),
        },
      ],
      [sortingField, sortingOrder]
    );

    const handleMenuClick = useCallback(
      (e: any) => {
        handleSort(e.key as CommunityAssetFolderField);
      },
      [handleSort]
    );

    const menuProps = useMemo(
      () => ({
        items: _items,
        onClick: handleMenuClick,
      }),
      [_items, handleMenuClick]
    );

    const [_folders, _setFolders] = useState<CommunityAssetsFolder[]>([]);

    const folderReorder = (
      communityId: string,
      folderId: string,
      newIndex: number
    ) => {
      setIsFolderReorderLoading(true);

      communityAssetsApi
        .assetsFolderReorder(communityId, folderId, newIndex)
        .catch((error) => {
          notification.error({ message: `Reorder failed: ${error.message}` });
        })
        .finally(() => {
          setIsFolderReorderLoading(false);
        });
    };

    useEffect(() => {
      _setFolders(sortedAssets);
    }, [sortedAssets]);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        _setFolders((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over?.id);

          return arrayMove(items, oldIndex, newIndex);
        });

        const newIndex = _folders?.findIndex((item) => item.id === over?.id);
        folderReorder(communityId, active.id?.toString(), newIndex + 1);
      }
    };

    return (
      <Page.Wrapper width="large">
        <Spin size="large" spinning={loading || !communityId}>
          <Modal
            title="Create new folder"
            open={isCreateFolderModalOpen}
            onOk={createFolder}
            okButtonProps={{
              loading: loading,
            }}
            cancelButtonProps={{
              disabled: loading,
            }}
            onCancel={() => {
              setIsCreateFolderModalOpen(false);
              form.resetFields();
            }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ title: '', description: '' }}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please input the title' }]}
              >
                <Input placeholder="Title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ message: 'Please input the description' }]}
              >
                <Input placeholder="Description" />
              </Form.Item>
            </Form>
          </Modal>
          <Stack spacing="extraLoose" vertical>
            {!showActions && sortedAssets.length ? (
              <Dropdown.Button
                type={sortingField ? 'primary' : 'default'}
                menu={menuProps}
                onClick={handleSortClear}
              >
                {sortingField ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Reset
                    <RefreshCcw05
                      width={iconProps.width}
                      height={iconProps.height}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Sort <SwitchVertical02 {...iconProps} />
                  </div>
                )}
              </Dropdown.Button>
            ) : null}
            {showActions ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={_folders.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Flex vertical>
                    {_folders.length
                      ? _folders.map((folder) => {
                          return (
                            <AssetsSection
                              isDraggable={showActions}
                              key={folder.id}
                              title={folder.name || ''}
                              description={folder.description || ''}
                              assetsItems={items[folder.id] || []}
                              folderId={folder.id}
                              communityId={communityId}
                              fetchFoldersAndItems={fetchFoldersAndItems}
                              expandedKeys={expandedKeys}
                              setExpandedKeys={setExpandedKeys}
                              isUserModerator={isUserModerator}
                              isFolderReorderLoading={isFolderReorderLoading}
                            />
                          );
                        })
                      : !loading && <Empty />}
                  </Flex>
                </SortableContext>
              </DndContext>
            ) : (
              <Flex gap={24} vertical>
                {sortedAssets.length
                  ? sortedAssets.map((folder) => {
                      return (
                        <AssetsSection
                          showActions={showActions}
                          isDraggable={showActions}
                          key={folder.id}
                          title={folder.name || ''}
                          description={folder.description || ''}
                          assetsItems={items[folder.id] || []}
                          folderId={folder.id}
                          communityId={communityId}
                          fetchFoldersAndItems={fetchFoldersAndItems}
                          expandedKeys={expandedKeys}
                          setExpandedKeys={setExpandedKeys}
                          isUserModerator={isUserModerator}
                          isFolderReorderLoading={isFolderReorderLoading}
                        />
                      );
                    })
                  : !loading && <Empty />}
              </Flex>
            )}
          </Stack>
        </Spin>
      </Page.Wrapper>
    );
  }
);
