import { useState, useCallback } from 'react';
import { notification } from 'antd';
import { toPairs } from 'lodash';

import { CommunityAssetsItem } from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';

import * as T from '../rename-folder-modal.types';

export const useFolderRename = ({
  folderId,
  communityId,
  onFetchSuccess,
  assetsItems,
}: {
  folderId: string;
  communityId: string;
  onFetchSuccess: () => void;
  assetsItems: Array<CommunityAssetsItem>;
}) => {
  const [folderRename, setFolderRename] = useState<Pick<
    CommunityAssetsItem,
    'id' | 'name' | 'description'
  > | null>(null);

  const [isEditFilesInFolderLoading, setIsEditFilesInFolderLoading] =
    useState(false);
  const [isEditFolderLoading, setIsEditFolderLoading] = useState(false);

  const handleFolderModalCancel = useCallback(() => {
    setFolderRename(null);
  }, []);

  const handleFilesSubmit = useCallback(
    (files: T.TFormFiles) => {
      const filesPromises = toPairs(files)
        .map(([fileId, file]) => {
          const oldFile = assetsItems?.find((item) => fileId === item.id);

          if (oldFile) {
            const isChanged =
              oldFile.name !== file.name ||
              oldFile.description !== file.description;

            if (isChanged) {
              return communityAssetsApi.updateCommunityAssetsItem(
                communityId,
                folderId,
                fileId,
                {
                  name: file.name,
                  description: file.description ? file.description : '',
                }
              );
            }
          }

          return Promise.resolve();
        })
        .filter(Boolean);

      return Promise.all(filesPromises);
    },
    [communityId, folderId, assetsItems]
  );

  const editFilesInFolder = (files: T.TFormFiles) => {
    setIsEditFilesInFolderLoading(true);

    handleFilesSubmit(files)
      .then(() => {
        onFetchSuccess();
        notification.success({
          message: 'Items renamed successfully.',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Failed to rename items.',
        });
      })
      .finally(() => {
        setIsEditFilesInFolderLoading(false);
      });
  };

  const editFolder = (name: string, description?: string) => {
    setIsEditFolderLoading(true);

    communityAssetsApi
      .updateCommunityAssetsFolder(communityId, folderId, {
        name,
        description,
      })
      .then(() => {
        onFetchSuccess();
        notification.success({
          message: 'Folder renamed successfully.',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Failed to rename folder.',
        });
      })
      .finally(() => {
        setIsEditFolderLoading(false);
      });
  };

  return {
    editFolder,
    folderRename,
    setFolderRename,
    editFilesInFolder,
    isEditFolderLoading,
    handleFolderModalCancel,
    isEditFilesInFolderLoading,
  };
};
