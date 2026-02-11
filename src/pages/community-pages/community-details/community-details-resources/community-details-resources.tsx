import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Empty, Spin } from 'antd';

import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { AssetsSection } from 'src/pages/admin-pages/admin-community/admin-community-about/pages/assets/assests-section';

import { useCommunityDetailsStore } from '../community-details.provider';

export const CommunityDetailsResources = observer(() => {
  const {
    folders,
    communityId,
    assetsItems,
    assetsLoading,
    fetchFoldersAndItems,
  } = useCommunityDetailsStore();

  const [expandedKeys, setExpandedKeys] = useState<string | string[]>([]);

  useEffect(() => {
    fetchFoldersAndItems();
  }, []);

  return (
    <Stack vertical>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        <Spin size="large" spinning={assetsLoading}>
          <Stack vertical spacing="extraLoose">
            {folders?.length > 0
              ? folders?.map((folder) => {
                  return (
                    <AssetsSection
                      isDraggable={false}
                      key={folder.id}
                      title={folder.name || ''}
                      description={folder.description || ''}
                      assetsItems={assetsItems?.[folder.id] || []}
                      folderId={folder.id}
                      communityId={communityId}
                      fetchFoldersAndItems={fetchFoldersAndItems}
                      expandedKeys={expandedKeys}
                      setExpandedKeys={setExpandedKeys}
                      isUserModerator={false}
                      isFolderReorderLoading={assetsLoading}
                    />
                  );
                })
              : !assetsLoading && <Empty />}
          </Stack>
        </Spin>
      </Page.Content>
    </Stack>
  );
});
