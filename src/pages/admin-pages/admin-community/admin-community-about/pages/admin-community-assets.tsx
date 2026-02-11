import { Page } from 'src/components/common/page/page';
import { useCommunityManagementStore } from '../../admin-community.provider';
import { AssetsPage } from './assets/assets.page';
import { Skeleton } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { observer } from 'mobx-react';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Folder, Plus } from '@untitled-ui/icons-react';
import { Button } from 'src/components/common/Button/Button';
import { useState } from 'react';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

export const AdminCommunityAssetsPage = observer(() => {
  const { community, permissions } = useCommunityManagementStore();
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const { globalPermission } = useCurrentUserStore();

  if (!community || !community.id) {
    return <Skeleton active />;
  }

  const canActionAssets = !!(
    permissions?.assetsAll || globalPermission?.assetsAll
  );

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader title="Assets" icon={<Folder />}>
          {canActionAssets && (
            <Button
              type="primary"
              icon={<Plus width={16} height={16} />}
              onClick={() => setIsCreateFolderModalOpen(true)}
            >
              Folder
            </Button>
          )}
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content>
        <AssetsPage
          communityId={community.id}
          isCreateFolderModalOpen={isCreateFolderModalOpen}
          setIsCreateFolderModalOpen={setIsCreateFolderModalOpen}
          showActions={canActionAssets}
        />
      </Page.Content>
    </>
  );
});
