import { Pencil01, Trash01 } from '@untitled-ui/icons-react';
import { notification, Popover, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
// import { useCurrentUserStore } from 'src/pages/authorized/authorized.layout';
import { UserRole } from 'src/transport/account/account.dto';
import {
  AssetsTypeEnum,
  CommunityAssetsItem,
} from 'src/transport/communities/communities.dto';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';

import styled from 'styled-components';
import { iconSizes } from './assets.utils';
import { useOnClickOutside } from './hooks/useOnClickOutside';

const { Text } = Typography;

interface AssetsActionsProps {
  communityId: string;
  fetchFoldersAndItems: () => void;
  folderId: string;
  onRename: (item: CommunityAssetsItem) => void;
  record: CommunityAssetsItem;
}

export const AssetsActions: React.FC<AssetsActionsProps> = ({
  communityId,
  fetchFoldersAndItems,
  folderId,
  onRename,
  record,
}) => {
  const { user } = useCurrentUserStore();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);
  const { track } = useEngagementTracker();

  useOnClickOutside(popoverRef, () => setVisible(false));

  const handleFileAction = () => {
    if (
      record.type === AssetsTypeEnum.Link ||
      record.type === AssetsTypeEnum.PDF
    ) {
      window.open(record.path, '_blank');
    } else {
      setLoading(true);
      fetch(record.path)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = record.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          track({
            action: EngagementAction.DownloadAsset,
            entityId: record.id,
            entityName: record.name,
            entityUrl: window.location.href,
          });
        })
        .catch((error) => {
          notification.error({ message: `Failed to download file: ${error}` });
        })
        .finally(() => setLoading(false));
    }
  };

  const deleteRecord = (record: CommunityAssetsItem) => {
    setLoading(true);
    communityAssetsApi
      .deleteCommunityAssetsItem(communityId, folderId, record.id)
      .then(() => {
        notification.success({ message: 'Item successfully deleted' });
        fetchFoldersAndItems();
      })
      .catch(() => {
        notification.error({
          message: 'Item not deleted. Try again.',
        });
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
      });
  };

  return (
    <Stack spacing="none" distribution="equalSpacing">
      <StyledButton
        size="small"
        type="link"
        loading={loading}
        onClick={handleFileAction}
      >
        {record.type === AssetsTypeEnum.Link
          ? 'Open link'
          : record.type === AssetsTypeEnum.PDF
            ? 'View'
            : 'Download'}
      </StyledButton>
      {(user?.role == UserRole.Admin ||
        user?.role == UserRole.WorkSpaceOwner) && (
        <Stack alignment="center">
          <Button
            size="small"
            type="link"
            icon={<Pencil01 {...iconSizes} />}
            onClick={() => onRename(record)}
          />
          <Popover
            content={
              <div ref={popoverRef}>
                <Stack vertical>
                  <Text>Are you sure you want to delete this file?</Text>
                  <Stack>
                    <Button
                      danger
                      size="small"
                      type="primary"
                      onClick={() => deleteRecord(record)}
                      loading={loading}
                    >
                      Yes
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      disabled={loading}
                      onClick={() => setVisible(false)}
                    >
                      No
                    </Button>
                  </Stack>
                </Stack>
              </div>
            }
            title="Confirm Deletion"
            trigger="click"
            open={visible}
            onOpenChange={(visible) => setVisible(visible)}
          >
            <Button
              size="small"
              type="link"
              danger
              icon={<Trash01 {...iconSizes} />}
              onClick={() => setVisible(true)}
              style={{ top: -1 }}
            />
          </Popover>
        </Stack>
      )}
    </Stack>
  );
};

const StyledButton = styled(Button)`
  color: #4933a4 !important;

  &:hover {
    text-decoration: underline;
  }
`;
